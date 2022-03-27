<template>
  <div id="category">
    <nav-bar class="nav-bar">
      <template v-slot:center>
        <div>商品分类</div>
      </template>
    </nav-bar>
    <div class="content">
      <cate-tab-menu :categories="categories" @selectItem="selectItemHandler"></cate-tab-menu>
      <scroll id="tab-content" :data="[categoryData]">
        <div>
          <cate-tab-content :subcategories="showSubcategory"/>
          <page-tab-control :titles="['综合', '新品', '销量']" @tabClick="tabClickHandler"/>
          <cate-tab-detail :category-detail="showCategoryDetail"/>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import {getCategoriesApi, getSubCategoriesApi, getCategoryDetailApi} from "@/api/cate";
import {POP, NEW, SELL} from "@/utils/const";
import {tabControlMixin} from '@/mixins/mixin';
import CateTabMenu from "@/views/modules/cate/cate-tab-menu";
import CateTabContent from "@/views/modules/cate/cate-tab-content";
import PageTabControl from "@/views/page-tab-control";
import CateTabDetail from "@/views/modules/cate/cate-tab-detail";

export default {
  name: "cate",
  mixins: [tabControlMixin],
  components: {CateTabDetail, PageTabControl, CateTabContent, CateTabMenu},
  data() {
    return {
      categories: [],
      categoryData: {},
      currentIndex: -1,
    }
  },
  created() {
    this.getCategories();
  },
  computed: {
    showSubcategory() {
      if (this.currentIndex === -1) return {}
      return this.categoryData[this.currentIndex].subcategories.list
    },
    showCategoryDetail() {
      if (this.currentIndex === -1) return []
      return this.categoryData[this.currentIndex].categoryDetail[this.currentType]
    }
  },
  methods: {
    /**
     * 事件监听
     */
    //获取选中的类别详细数据
    selectItemHandler(index) {
      this.getSubCategories(index);
    },
    /**
     * 网络请求
     */
    // 获取分类数据
    getCategories() {
      getCategoriesApi().then(res => {
        // 获取分类数据
        this.categories = res.data.category.list;
        // 初始化每个类别的子数据
        for (let i = 0; i < this.categories.length; i++) {
          this.categoryData[i] = {
            //子分类数据
            subcategories: {},
            //分类商品类别数据
            categoryDetail: {
              'pop': [],
              'new': [],
              'sell': []
            }
          }
        }
        this.getSubCategories(0);
      });
    },

    // 获取子分类数据
    getSubCategories(index) {
      this.currentIndex = index;
      const maitKey = this.categories[index].maitKey;
      getSubCategoriesApi(maitKey).then(res => {
        this.categoryData[index].subcategories = res.data;
        //变为了数组，需要解构，重新转换成对象
        this.categoryData = {...this.categoryData};
        this.getCategoryDetail(POP);
        this.getCategoryDetail(SELL);
        this.getCategoryDetail(NEW);
      })
    },

    // 获取子分类下的商品详细信息
    getCategoryDetail(type) {
      // 1.获取请求的miniWallkey
      const miniWallkey = this.categories[this.currentIndex].miniWallkey;
      // 2.发送请求,传入miniWallkey和type
      getCategoryDetailApi(miniWallkey, type).then(res => {
        // 3.将获取的数据保存下来
        this.categoryData[this.currentIndex].categoryDetail[type] = res;
        this.categoryData = {...this.categoryData}
      })
    },


  }
}
</script>

<style scoped>
#category {
  height: 100vh;
}

.nav-bar {
  background-color: var(--color-tint);
  font-weight: 700;
  color: #fff;
}

.content {
  overflow: hidden;

  position: absolute;
  left: 0;
  right: 0;
  top: 44px;
  bottom: 49px;

  display: flex;
}

#tab-content {
  height: 100%;
  flex: 1;
}
</style>
