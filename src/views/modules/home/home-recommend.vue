<template>
  <div class="recommend">
    <div class="recommend-list" v-for="item in recommends">
      <a :href="item.link">
        <img :src="item.image" :alt="item.name">
        <div>{{ item.title }}</div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "home-recommend",
  props: {
    recommends: {
      type: Array,
      default() {
        return [];
      }
    }
  }
}
</script>

<style scoped>
.recommend {
  display: flex;
  width: 100%;

  text-align: center;
  font-size: 16px;

  padding: 5% 0 5%;

  border-bottom: 8px solid #eee;
}

.recommend-list {
  flex: 1;
}
.recommend-list img{
  width: 90%;
  margin-bottom: 5%;
}
</style>
