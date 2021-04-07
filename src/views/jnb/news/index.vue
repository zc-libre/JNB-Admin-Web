<!--
<template>
  <div class="app-container">
    <div class="head-container">
      <el-row type="flex">
        <el-input v-model="query.cityName" clearable placeholder="文章标题" style="width: 185px;" class="filter-item" @keyup.enter.native="getDataList" />
        <el-date-picker
          v-model="query.date"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <el-button
          class="filter-item"
          size="mini"
          type="success"
          icon="el-icon-search"
          style="margin-left: 10px"
          @click="getDataList"
        >搜索</el-button>
      </el-row>
      <span class="crud-opts-left">
        <el-button
          v-permission="['admin', 'excel:edit']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="toAdd"
        >
          新增
        </el-button>
        <el-button
          v-permission="['admin', 'excel:edit']"
          class="filter-item"
          size="mini"
          type="success"
          icon="el-icon-edit"
          :disabled="editShowStatus"
          @click="edit()"
        >
          修改
        </el-button>
        <el-popconfirm
          confirm-button-text="好的"
          cancel-button-text="不用了"
          icon="el-icon-info"
          icon-color="red"
          title="确定删除吗？"
          @onConfirm="batchDelete"
        >
          <el-button
            slot="reference"
            v-permission="['admin', 'excel:del']"
            class="filter-item"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="delShowStatus"
          >
            删除</el-button>
        </el-popconfirm>
      </span>
      <el-main>
        &lt;!&ndash;表单组件&ndash;&gt;
        <el-row type="flex" justify="center">
          <el-card class="box-card">
            <el-row>
              <el-col>
                <transition name="el-zoom-in-center">
                  <el-table
                    v-loading="loading"
                    :data="tableData"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    highlight-current-row
                    stripe
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                  >
                    <el-table-column
                      type="selection"
                      width="55"
                    />
                    <el-table-column
                      prop="name"
                      label="店铺名称"
                      width="180"
                    />
                    <el-table-column
                      prop="basicTask"
                      label="基础任务"
                      width="180"
                    />
                    <el-table-column
                      prop="challengeTask"
                      label="挑战任务"
                      width="180"
                    />
                    <el-table-column
                      prop="partName"
                      label="军团"
                      width="100"
                    />
                    <el-table-column
                      prop="areaName"
                      label="区域"
                      width="100"
                    />
                    <el-table-column v-permission="['admin','excel:edit','excel:del']" label="操作" width="150px" align="center">
                      <template slot-scope="scope">
                        <el-button
                          v-permission="['admin','excel:edit']"
                          size="mini"
                          type="primary"
                          icon="el-icon-edit"
                          @click="toEdit(scope.row)"
                        />
                        <el-popconfirm
                          confirm-button-text="好的"
                          cancel-button-text="不用了"
                          icon="el-icon-info"
                          icon-color="red"
                          title="确定删除吗？"
                          @onConfirm="onConfirm(scope.row.id)"
                        >
                          <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
                        </el-popconfirm>
                      </template>
                    </el-table-column>
                  </el-table>
                </transition>

              </el-col>
            </el-row>

            <el-row>
              <div class="pagination-container">
                <el-pagination
                  class="pagiantion"
                  background
                  :current-page.sync="currPage"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="limit"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalCount"
                  @size-change="handleSizeChange"
                  @current-change="getDataList"
                />
              </div>
            </el-row>
          </el-card>
        </el-row>
      </el-main>
    </div>
  </div>
</template>

<script>
// import { list, edit, del, batchDel, getPartList, getAreaListByPartId } from '@/api/excel/city'
export default {
  name: 'NewsIndex',
  data() {
    return {
      partList: [],
      areaList: [],
      fullscreenLoading: false,
      loading: false,
      currPage: 1,
      limit: 10,
      totalCount: 10,
      tableData: [],
      query: {
        cityName: null,
        partId: null,
        areaId: null,
        limit: '10',
        page: '1'
      },
      form: {
        id: '',
        name: '',
        basicTask: '',
        challengeTask: '',
        partId: '',
        areaId: '',
        isDeleted: ''
      },
      permission: {
        add: ['admin', 'excel:add'],
        edit: ['admin', 'excel:edit'],
        del: ['admin', 'excel:del']
      },
      rules: {
        name: [
          { required: true, message: '店铺名称不能为空', trigger: 'blur' }
        ],
        basicTask: [
          { required: true, message: '基础任务不能为空', trigger: 'blur' }
        ],
        challengeTask: [
          { required: true, message: '挑战任务不能为空', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请选择地区', trigger: 'blur' }
        ],
        part: [
          { required: true, message: '请选择军团', trigger: 'blur' }
        ]
      },
      ids: [],
      delShowStatus: true,
      editShowStatus: true,
      status: false
    }
  },
  created() {
    this.getDataList()
    this.initPartList()
  },
  methods: {
    toAdd() {
      this.form = {}
      this.searchPartList()
      this.edit()
    },
    searchPartList() {
      getPartList().then(res => {
        this.form.partList = res.data
      })
      console.log(this.form)
    },
    searchAreaList() {
      getAreaListByPartId(this.form.partId).then(res => {
        this.areaList = res.data.areaList
      })
    },
    getAreaList() {
      getAreaListByPartId(this.query.partId).then(res => {
        this.areaList = res.data.areaList
      })
    },
    initPartList() {
      getPartList().then(res => {
        this.partList = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    edit() {
      this.status = true
    },
    submit() {
      edit(JSON.stringify(this.form)).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '修改成功！',
            type: 'success'
          })
          this.form = {}
          this.status = false
          this.getDataList()
        } else {
          this.status = false
          this.$message({
            message: '修改失败！',
            type: 'error'
          })
        }
      })
    },
    cancelSubmit() {
      this.status = false
    },
    toEdit(val) {
      getAreaListByPartId(val.partId).then(res => {
        this.areaList = res.data.areaList
      })
      this.form = val
      this.status = true
    },
    batchDelete() {
      batchDel(JSON.stringify(this.ids)).then(res => {
        this.$message({
          message: '删除成功！！',
          type: 'success'
        })
        this.getDataList()
      })
    },
    onConfirm(id) {
      del(id).then(res => {
        this.$message({
          message: '删除成功！！',
          type: 'success'
        })
        this.getDataList()
      }).catch(error => {
        console.log(error)
      })
    },
    handleSelectionChange(val) {
      if (val.length !== 0) {
        this.form = val[0]
      }
      if (val.length < 1) {
        this.ids = []
        this.delShowStatus = true
        return
      }
      for (let i = 0; i < val.length; i++) {
        this.ids[i] = val[i].id
      }
      this.delShowStatus = false
      this.editShowStatus = this.ids.length > 1
    },
    handleSizeChange(val) {
      this.limit = val
      this.getDataList()
    },
    formatDate(row, column) {
      // 获取单元格数据
      const data = row[column.property]
      const dt = new Date(data)
      return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()
    },
    getDataList() {
      this.loading = true
      this.query.page = this.currPage + ''
      this.query.limit = this.limit + ''
      list(JSON.stringify(this.query)).then(res => {
        this.tableData = res.page.list
        this.totalCount = res.page.totalCount
      })
      this.loading = false
    }
  }
}
</script>
-->
