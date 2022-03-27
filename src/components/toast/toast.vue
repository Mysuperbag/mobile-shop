<template>
  <div class="toast" v-show="isShow">
    <div>{{ message }}</div>
  </div>
</template>

<script>
export default {
  name: "toast",
  data() {
    return {
      message: '',
      isShow: false
    }
  },
  methods: {
    showHandler(message, duration = 500) {
      this.isShow = true;
      this.message = message;

      setTimeout(() => {
        this.isShow = false;
        this.message = "";
      }, duration);
    }
  }
}
</script>

<style scoped>
  .toast {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 8px 10px;

    z-index: 999;

    color: #FFFFFF;
    background-color: rgba(0, 0, 0, 0.75);;
  }
</style>
