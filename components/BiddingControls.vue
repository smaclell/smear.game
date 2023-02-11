<template>
  <div>
    <div class="text-center py-4">
      <strong v-if="show">Your turn to Bid</strong>
      <strong v-else-if="best > 0">{{ winner }} bid {{ best }}</strong>
      <strong v-else>Still waiting for that first bid ...</strong>
    </div>
    <div v-if="show" class="text-center py-4">
      <button
        class="btn btn-blue"
        :disabled="best >= 2 || !show"
        @click="bid(2)"
      >
        2
      </button>
      <button
        class="btn btn-blue"
        :disabled="best >= 3 || !show"
        @click="bid(3)"
      >
        3
      </button>
      <button
        class="btn btn-blue"
        :disabled="best >= 4 || !show"
        @click="bid(4)"
      >
        4
      </button>
      <button
        class="btn btn-blue"
        :disabled="best >= 5 || !show"
        @click="bid(5)"
      >
        5
      </button>
    </div>
    <div v-if="show" class="text-center py-4">
      <button class="btn btn-blue" :disabled="!show" @click="bid(-1)">
        Pass
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
type Props = {
  show: boolean;
  best: number;
  winner: string;
  bid: (value: number) => void;
};

defineProps<Props>();
</script>
