import { Peer } from 'peerjs';
import { defineStore } from 'pinia';
import { useGameStore } from './game';
import { PlayerIndex } from './Player';
import { Card } from '~/CardTypes';

export enum ConnectionMode {
  Lobby = 'Lobby',
  Host = 'Host',
  Player = 'Player',
}

const sentinel = () => {};

type Send = (data: string) => void;
type Unsubscribe = typeof sentinel;

interface ISender {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  send(data: any, chunked?: boolean): void;
  removeAllListeners(): void;
}

const fakeConnnection: ISender = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  send(data: any, chunked?: boolean) {},
  removeAllListeners() {},
};

type State = {
  mode: ConnectionMode;
  name: string;
  gameId: string;
  localId: -1 | 0 | 1 | 2 | 3;
  sender: Send;
  unsubscribe: Unsubscribe;
};

interface OrderMessage {
  action: 'order';
  payload: [string, string, string, string];
}

interface RequestMessage {
  action: 'request';
  payload: {
    name: string;
    position: 0 | 1 | 2 | 3;
  };
}

interface StartMessage {
  action: 'start';
  payload: {
    dealer: number;
    deck: Card[];
  };
}

interface BidMessage {
  action: 'bid';
  playerId: PlayerIndex;
  payload: number;
}

interface PlayMessage {
  action: 'play';
  playerId: PlayerIndex;
  payload: Card;
}

type Payloads =
  | RequestMessage
  | OrderMessage
  | StartMessage
  | BidMessage
  | PlayMessage;

export const DefaultGame = 'smear-game-turkey-taco-butterfly';

export const useConnectionsStore = defineStore('connections', {
  state: (): State => ({
    mode: ConnectionMode.Lobby,
    localId: -1,
    name: '',
    gameId: '',
    sender: sentinel,
    unsubscribe: sentinel,
  }),
  actions: {
    host(gameId: string) {
      if (this.mode !== ConnectionMode.Lobby) {
        throw new Error('You can only become the host from the lobby');
      }

      const peer = new Peer(gameId);

      const connections = [fakeConnnection];

      this.$patch({
        mode: ConnectionMode.Host,
        gameId,
        localId: 0,
        sender: (data: string) => connections.forEach((c) => c.send(data)),
        unsubscribe: sentinel,
      });

      peer.on('open', () => {
        // this.disconnect();
      });

      peer.on('error', (e) => console.error(e));

      peer.on('close', () => {
        // this.disconnect();
      });

      peer.on('connection', (conn) => {
        connections.push(conn);

        conn.on('open', () => {
          const game = useGameStore();

          const payload = game.players.map((p) => p.name) as [
            string,
            string,
            string,
            string
          ];
          const message: OrderMessage = { action: 'order', payload };

          this.send(message);
        });

        conn.on('data', (d) => {
          const data = JSON.parse(d as string) as Payloads;
          this.receive(data);
        });
      });

      const stop = this._watch();
      this.unsubscribe = () => {
        stop();
        connections.forEach((c) => c.removeAllListeners());

        peer.removeAllListeners();
        peer.destroy();
      };
    },
    join(gameId: string) {
      if (this.mode !== ConnectionMode.Lobby) {
        throw new Error('You can only join from the lobby');
      }

      const peer = new Peer();

      peer.on('open', () => {
        const conn = peer.connect(gameId, {
          reliable: true,
          serialization: 'json',
        });

        conn.on('close', () => {
          this.disconnect();
        });

        conn.on('data', (d) => {
          const data = JSON.parse(d as string) as Payloads;
          this.receive(data);
        });

        this.$patch({
          mode: ConnectionMode.Player,
          gameId,
          localId: -1,
          sender: (data: string) => conn.send(data),
        });

        const stop = this._watch();
        this.unsubscribe = () => {
          stop();
          conn.removeAllListeners();

          peer.removeAllListeners();
          peer.destroy();
        };
      });

      peer.on('error', (e) => console.error(e));
    },
    request(position: PlayerIndex) {
      this.send({
        action: 'request',
        payload: {
          name: this.name,
          position,
        },
      });
    },
    disconnect() {
      this.unsubscribe();

      this.$patch({
        mode: ConnectionMode.Lobby,
        unsubscribe: sentinel,
        gameId: 'unknown',
        localId: -1,
      });
    },
    receive(data: Payloads) {
      // eslint-disable-next-line no-console
      console.log('received', data);
      const game = useGameStore();
      if (data.action === 'order') {
        // @ts-ignore - it is fine
        this.localId = data.payload.indexOf(this.name);
        game.order(0, data.payload);
      } else if (
        data.action === 'request' &&
        this.mode === ConnectionMode.Host
      ) {
        const { name, position } = data.payload;
        const payload: [string, string, string, string] = ['', '', '', ''];
        game.$patch((state) => {
          const players = state.players;
          for (let i = 0; i < players.length; i++) {
            const player = players[i];
            if (player.name === name) {
              player.name = '';
            } else if (i === position) {
              player.name = name;
            }

            payload[i] = player.name;
          }
        });

        const message: OrderMessage = {
          action: 'order',
          payload,
        };

        this.send(message);
        this.receive(message);
      } else if (data.action === 'bid') {
        if (data.playerId === this.localId) {
          return;
        }

        const playerId = this.translate(data.playerId);

        game.bid(playerId as PlayerIndex, data.payload);
      } else if (data.action === 'play') {
        if (data.playerId === this.localId) {
          return;
        }
        const playerId = this.translate(data.playerId);

        game.play(playerId as PlayerIndex, data.payload);
      } else if (data.action === 'start' && this.mode !== ConnectionMode.Host) {
        const names = game.players.map((p) => p.name) as [
          string,
          string,
          string,
          string
        ];
        game.order(this.localId, names);

        const playerId = this.translate(data.payload.dealer);
        game.start(this.localId, playerId, data.payload.deck);
      }
    },
    send(data: Payloads) {
      // eslint-disable-next-line no-console
      console.log('sending', data);
      const stringified = JSON.stringify(data);
      this.sender(stringified);
    },
    translate(remote: number): number {
      if (this.localId < 0) {
        throw new Error('Not connected');
      }

      return (remote + (4 - this.localId)) % 4;
    },
    _watch() {
      // host vs player is different
      if (this.mode === ConnectionMode.Lobby) {
        throw new Error('Not configured to watch');
      }

      const game = useGameStore();
      return game.$onAction(({ name: action, args, after }) => {
        if (action === 'start' && this.mode === ConnectionMode.Host) {
          after(() => {
            const [, dealer, deck] = args;
            this.send({
              action,
              payload: {
                dealer,
                deck,
              },
            });
          });
        }

        if (action === 'bid') {
          after((result) => {
            if (!result) {
              return;
            }

            if (this.localId === -1) {
              throw new Error('not configured on bid');
            }

            const [playerId, payload] = args;
            if (this.mode === ConnectionMode.Host) {
              this.send({
                action,
                playerId,
                payload,
              });
            } else if (this.mode === ConnectionMode.Player && playerId === 0) {
              this.send({
                action,
                playerId: this.localId,
                payload,
              });
            }
          });
        }

        if (action === 'play') {
          after((result) => {
            if (!result) {
              return;
            }

            if (this.localId === -1) {
              throw new Error('not configured on play');
            }

            const [playerId, payload] = args;
            if (this.mode === ConnectionMode.Host) {
              this.send({
                action,
                playerId,
                payload,
              });
            } else if (this.mode === ConnectionMode.Player && playerId === 0) {
              this.send({
                action,
                playerId: this.localId,
                payload,
              });
            }
          });
        }
      }, true);
    },
  },
});
