<script setup lang="ts">
import type { RolldownAssetInfo } from '@rolldown-analyzer/core/types';
import DataVirtualList from '@rolldown-analyzer/core/ui/components/DataVirtualList.vue';

defineProps<{
  assets: RolldownAssetInfo[];
}>();
</script>

<template>
  <div p4>
    <DataVirtualList :items="assets" key-prop="filename">
      <template #default="{ item }">
        <div flex pb2>
          <AssetsListItem :asset="item" />
        </div>
      </template>
    </DataVirtualList>
  </div>
</template>
