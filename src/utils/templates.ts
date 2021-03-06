export const blankPageTpl = (name: string) => `
<template>
  <div class="${name}-page">
    <h1>This is ${name} page</h1>
  </div>
</template>
<script>
export default {
  
}
</script>
<style scoped>

</style>

`;

export const basicFormPageTpl = (name: string) => `
<template>
  <div>
    <el-form :model="${name}Form" :rules="rules" ref="${name}Form" label-width="100px" class="${name}Form">
      <el-form-item label="活动名称" prop="name">
        <el-input v-model="${name}Form.name"></el-input>
      </el-form-item>
      <el-form-item label="活动区域" prop="region">
        <el-select v-model="${name}Form.region" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间" required>
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker type="date" placeholder="选择日期" v-model="${name}Form.date1" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-time-picker type="fixed-time" placeholder="选择时间" v-model="${name}Form.date2" style="width: 100%;"></el-time-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="即时配送" prop="delivery">
        <el-switch v-model="${name}Form.delivery"></el-switch>
      </el-form-item>
      <el-form-item label="活动性质" prop="type">
        <el-checkbox-group v-model="${name}Form.type">
          <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
          <el-checkbox label="地推活动" name="type"></el-checkbox>
          <el-checkbox label="线下主题活动" name="type"></el-checkbox>
          <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="特殊资源" prop="resource">
        <el-radio-group v-model="${name}Form.resource">
          <el-radio label="线上品牌商赞助"></el-radio>
          <el-radio label="线下场地免费"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动形式" prop="desc">
        <el-input type="textarea" v-model="${name}Form.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('${name}Form')">立即创建</el-button>
        <el-button @click="resetForm('${name}Form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ${name}Form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change"
          }
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" }
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // TODO: submit form
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style scoped>
</style>

`;

export const injectComponent = (name: string, html: string) => `
<template>
  <div class="${name}-component">
    ${html}
  </div>
</template>
<script>
export default {
  props: {}
}
</script>
<style scoped>
</style>
`;

export const basicListPageTpl = (name: string) => `
<template>
    <div class="${name}-page">
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="date" label="日期" width="180">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="180">
            </el-table-column>
            <el-table-column prop="address" label="地址">
            </el-table-column>
        </el-table>
        <br>
        <el-pagination :current-page.sync="currentPage" @current-change="handleCurrentChange" small layout="prev, pager, next" :total="total">
        </el-pagination>
    </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 1,
      total: 50,
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ]
    }
  },
  methods: {
    handleCurrentChange(val) {
      console.log(val)
      // TODO: refresh list data
    }
  }
}
</script>

`;

export const basicDialogComTpl = (name: string) => `
<template>
    <el-dialog custom-class="${name}-Dialog" title="提示" :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false" :visible="visible" width="30%">
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="changeVisible(false)">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    refresh: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  methods: {
    changeVisible(visible) {
      this.$emit("update:visible", visible)
    },
    submit() {
      // submit some data
      this.refresh()
      this.changeVisible(false)
    }
  }
}
</script>
<style scoped lang="scss">
</style>

`;

export const basicListComTpl = (name: string) => `
<template>
    <div class="${name}">
        <el-table :data="data" stripe style="width: 100%">
            <el-table-column prop="date" label="日期" width="180">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="180">
            </el-table-column>
            <el-table-column prop="address" label="地址">
            </el-table-column>
        </el-table>
        <br>
        <el-pagination :current-page="currentPage" @current-change="handleCurrentChange" small layout="prev, pager, next" :total="total">
        </el-pagination>
    </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {}
  },
  methods: {
    handleCurrentChange(val) {
      this.$emit("update:currentPage", val)
      this.$emit("page-change", val)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

`;
