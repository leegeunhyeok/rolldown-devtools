<script setup lang="ts">
import type { SessionContext } from '@rolldown-analyzer/core/types';

defineProps<{
  session: SessionContext;
}>();
</script>

<template>
  <AnalyzePage :session="session" standalone />
</template>
