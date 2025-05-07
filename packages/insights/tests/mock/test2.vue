<script setup lang="ts">
import { ref } from 'vue';

const { prop1, prop1 } = defineProps<{
    prop1: string;
    prop2: number;
}>();

const ref1 = ref('1');
const ref2 = ref<number>(0);

const computed1 = computed(() => ref2.value * 2);
</script>

<template>
    <div class="tmp">Test 2</div>
</template>

<style>
.tmp {
    color: black;
}
</style>
