<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const ref1 = ref(0);
const ref2 = ref('1');

const c1 = computed(() => ref1.value + 1);

const { pause, resume, stop } = watch(ref2, () => {
    ref2.value = 'navid';
});

watch(ref1, () => {
    ref1.value = 4;
});

watch(ref1, (value) => {
    ref1.value = value;
}, {
    once: true,
    immediate: true,
});

computed(() => 2 + 2);
</script>

<template>
    <div class="">
        Test {{ c1 }}
    </div>
</template>
