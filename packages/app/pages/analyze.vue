<script setup lang="ts">
import type { SessionContext } from '@rolldown-analyzer/core/types/data';

defineProps<{
  session: SessionContext;
}>();
</script>

<template>
  <AnalyzePage :session="session" />
</template>
