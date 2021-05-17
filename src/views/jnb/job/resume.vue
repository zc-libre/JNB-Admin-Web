<template>
  <div class="app-container">
    <div class="head-container">
      <el-row type="flex">
        <el-input v-model="query.name" clearable placeholder="职位名称" style="width: 185px;" class="filter-item" @keyup.enter.native="getDataList" />
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
                      prop="name"
                      label="姓名"
                    />
                    <el-table-column
                      prop="gender"
                      label="性别"
                    />
                    <el-table-column
                      prop="birthday"
                      label="出生日期"
                      width="150"
                    />
                    <el-table-column
                      prop="phone"
                      label="电话"
                      width="150"
                    />
                    <el-table-column
                      prop="email"
                      label="邮箱"
                      width="150"
                    />
                    <el-table-column
                      prop="address"
                      label="籍贯"
                    />
                    <el-table-column
                      prop="resume"
                      label="简历附件"
                      width="300"
                    >
                      <template slot-scope="scope">
                        <el-popover
                          :content="'file/文档/' + scope.row.resume"
                          placement="top-start"
                          title="路径"
                          width="200"
                          trigger="hover"
                        >
                          <a
                            slot="reference"
                            :href="baseApi + '/file/文档/' + scope.row.resume"
                            class="el-link--primary"
                            style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
                            target="_blank"
                          >
                            {{ scope.row.resume }}
                          </a>
                        </el-popover>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="status"
                      label="是否处理过"
                    >
                      <template slot-scope="scope">
                        <el-switch
                          v-model="scope.row.status"
                          active-color="#13ce66"
                          inactive-color="#ff4949"
                          :active-value="1"
                          :inactive-value="0"
                          @change="statusChange(scope.row.status, scope.row.id)"
                          @focus="statusFocus(scope.row.status)"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="createTime"
                      label="创建时间"
                      width="280"
                    />
                    <el-table-column v-permission="['admin','excel:edit','excel:del']" label="操作" width="150px" align="center">
                      <template slot-scope="scope">
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
import { list, batchDel, status } from '@/api/jnb/resume'
import { parseTime } from '../../../utils/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Resume',
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
        name: '',
        age: '',
        gender: '',
        date: [],
        page: '1',
        limit: '10',
        start: '',
        end: ''
      },
      resume: {
        id: '',
        status: ''
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
    statusChange(val, id) {
      this.resume.id = id
      this.resume.status = val
      status(JSON.stringify(this.resume)).then(res => {
        this.$message({
          message: '状态修改成功',
          type: 'success'
        })
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
