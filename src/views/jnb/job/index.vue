<template>
  <div class="app-container">
    <div class="head-container">
      <el-row type="flex">
        <el-input v-model="query.jobName" clearable placeholder="职位名称" style="width: 185px;" class="filter-item" @keyup.enter.native="getDataList" />
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
          @confirm="batchDelete"
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
            删除
          </el-button>
        </el-popconfirm>
      </span>
      <el-main>
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
                    :header-cell-style="{textAlign: 'center'}"
                    :cell-style="{ textAlign: 'center' }"
                    stripe
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                  >
                    <el-table-column
                      type="selection"
                      width="55"
                    />
                    <el-table-column
                      prop="jobName"
                      label="职位名称"
                      width="400"
                    />
                    <el-table-column
                      prop="createTime"
                      label="创建时间"
                      width="280"
                    />
                    <el-table-column v-permission="['admin','excel:edit','excel:del']" label="操作" width="150px" align="center">
                      <template slot-scope="scope">
                        <el-button
                          v-permission="['admin','excel:edit']"
                          size="mini"
                          type="primary"
                          icon="el-icon-edit"
                          @click="toEdit(scope.row.id)"
                        />
                        <el-popconfirm
                          confirm-button-text="好的"
                          cancel-button-text="不用了"
                          icon="el-icon-info"
                          icon-color="red"
                          title="确定删除吗？"
                          @confirm="onConfirm(scope.row.id)"
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
import { list, batchDel } from '@/api/jnb/Job'
import { parseTime } from '../../../utils/index'
import { mapGetters } from 'vuex'
export default {
  name: 'JobList',
  data() {
    return {
      fullscreenLoading: false,
      loading: false,
      currPage: 1,
      limit: 10,
      totalCount: 10,
      fileList: [],
      tableData: [],
      query: {
        jobName: '',
        date: [],
        page: '1',
        limit: '10',
        start: '',
        end: ''
      },
      permission: {
        add: ['admin', 'excel:add'],
        edit: ['admin', 'excel:edit'],
        del: ['admin', 'excel:del']
      },
      ids: [],
      delShowStatus: true,
      editShowStatus: true,
      status: false
    }
  },
  computed: {
    ...mapGetters([
      'baseApi'
    ])
  },
  created() {
    this.getDataList()
  },

  methods: {
    edit() {
      this.status = true
    },
    toEdit(id) {
      this.$router.push({
        path: `/jnb/job/publish`,
        query: {
          id: id
        }
      })
    },
    batchDelete() {
      console.log(this.ids)
      batchDel(JSON.stringify(this.ids)).then(res => {
        this.$message({
          message: '删除成功！！',
          type: 'success'
        })
        this.getDataList()
      })
    },
    onConfirm(id) {
      this.ids.push(id)
      console.log(this.ids)
      batchDel(JSON.stringify(this.ids)).then(res => {
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
      if (val.length <= 1) {
        this.ids = []
        this.delShowStatus = true
        return
      }
      for (let i = 0; i < val.length; i++) {
        this.ids[i] = val[i].id
      }
      this.delShowStatus = false
      this.editShowStatus = this.ids.length > 1
      console.log(this.ids)
    },
    handleSizeChange(val) {
      this.limit = val
      this.getDataList()
    },
    getDataList() {
      this.loading = true
      this.query.page = this.currPage + ''
      this.query.limit = this.limit + ''
      this.query.start = parseTime(this.query.date[0], 'yyyy-MM-dd HH:mm:ss')
      this.query.end = parseTime(this.query.date[1], 'yyyy-MM-dd HH:mm:ss')
      var json = JSON.stringify(this.query)
      list(json).then(res => {
        this.tableData = res.data.records
        this.totalCount = res.data.total
      })
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
