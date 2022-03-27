<template>
  <div class="comment-info" v-if="Object.keys(comment).length !== 0">
    <div class="comment-header">
      <div class="header-title">用户评价</div>
      <div class="header-more">更多<i class="arrow-right"></i></div>
    </div>
    <div class="comment-user">
      <img :src="comment.user.avatar" :alt="comment.user.avatar"/>
      <span>{{ comment.user.uname }}</span>
    </div>
    <div class="comment-detail">
      <p>{{ comment.content }}</p>
      <div class="detail-other">
        <span class="detail-date">{{ comment.created | showDate }}</span>
        <span>{{ comment.style }}</span>
      </div>
      <div class="info-img-items">
        <img :src="item" v-for="(item, index) in comment.images" :alt="item">
      </div>
    </div>

  </div>
</template>

<script>
import {formatDate} from "@/utils/utils";

export default {
  name: "goods-detail-comment",
  props: {
    comment: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  filters: {
    showDate(value) {
      let date = new Date(value*1000);
      return formatDate(date, 'yyyy-MM-dd')
    }
  }
}
</script>

<style scoped>
.comment-info {
  padding: 5px 12px;
  color: #333;
  border-bottom: 5px solid #f2f5f8;
}

.comment-header {
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid rgba(0, 0, 0, .1);
}

.header-title {
  float: left;
  font-size: 15px;
}

.header-more {
  float: right;
  margin-right: 10px;
  font-size: 13px;
}

.comment-user {
  padding: 10px 0 5px;
}

.comment-user img {
  width: 42px;
  height: 42px;
  border-radius: 50%;
}

.comment-user span {
  position: relative;
  font-size: 15px;
  top: -15px;
  margin-left: 10px;
}

.comment-detail {
  padding: 0 5px 15px;
}

.comment-detail p {
  font-size: 14px;
  color: #777;
  line-height: 1.5;
}

.comment-detail .detail-other {
  font-size: 12px;
  color: #999;
  margin-top: 10px;
}

.detail-other .detail-date {
  margin-right: 8px;
}


.info-img-items {
  margin-top: 10px;
}

.info-img-items img {
  width: 70px;
  height: 70px;
  margin-right: 5px;
}

</style>
