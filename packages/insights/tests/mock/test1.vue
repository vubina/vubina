<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    prop1: string;
    prop2: number;
}>();

const ref1 = ref('test');
const ref2 = ref<number>(0);

const computed1 = computed(() => ref2.value + 1);
</script>
<template>
    <div class="">Test 1</div>
</template>
