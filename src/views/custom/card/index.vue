<template>
  <div class="app-container">
    <el-card shadow="always">
    <!-- 查询 -->
    <el-form
      :model="state.queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
    <el-form-item label="名称" prop="title">
        <el-input
           v-model="state.queryParams.title"
           placeholder="请输入名称"
           clearable
           @keyup.enter.native="handleQuery"
        />
     </el-form-item>
     <el-form-item label="过期时间" prop="expireAt">
       <el-date-picker clearable style="width: 200px"
             v-model="state.queryParams.expireAt"
             type="datetime"
             placeholder="选择过期时间">
       </el-date-picker>
     </el-form-item>
    <el-form-item label="识别码" prop="code">
        <el-input
           v-model="state.queryParams.code"
           placeholder="请输入识别码"
           clearable
           @keyup.enter.native="handleQuery"
        />
     </el-form-item>
    <el-form-item label="组织" prop="organize">
        <el-input
           v-model="state.queryParams.organize"
           placeholder="请输入组织"
           clearable
           @keyup.enter.native="handleQuery"
        />
     </el-form-item>
    <el-form-item label="持卡" prop="name">
        <el-input
           v-model="state.queryParams.name"
           placeholder="请输入持卡"
           clearable
           @keyup.enter.native="handleQuery"
        />
     </el-form-item>
    <el-form-item label="卡号" prop="cardNo">
        <el-input
           v-model="state.queryParams.cardNo"
           placeholder="请输入卡号"
           clearable
           @keyup.enter.native="handleQuery"
        />
     </el-form-item>
     <el-form-item>
       <el-button type="primary" @click="handleQuery">
         <SvgIcon name="elementSearch" />搜索</el-button>
       <el-button @click="resetQuery">
         <SvgIcon name="elementRefresh" />
         重置
       </el-button>
     </el-form-item>
    </el-form>
    </el-card>
    <el-card class="box-card">
        <template #header>
           <div class="card-header">
             <span class="card-header-text">Card列表</span>
             <div>
               <el-button
                  type="primary"
                  plain
                  v-auth="'custom:card:add'"
                  @click="onOpenAddModule"
                  ><SvgIcon name="elementPlus" />新增</el-button>
               <el-button
                 type="danger"
                 plain
                 v-auth="'custom:card:delete'"
                 :disabled="state.multiple"
                 @click="onTabelRowDel"
                 ><SvgIcon name="elementDelete" />删除</el-button>
             </div>
           </div>
        </template>
    <!--数据表格-->
    <el-table
      v-loading="state.loading"
      :data="state.tableData"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="名称" align="center" prop="title" />
      <el-table-column label="过期时间" align="center" prop="expireAt" width="180">
        <template #default="scope">
             <span>{{ dateStrFormat(scope.row.expireAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="识别码" align="center" prop="code" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="CreateTime" align="center" prop="createTime" width="180">
        <template #default="scope">
             <span>{{ dateStrFormat(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="银行" align="center" prop="bank" />
      <el-table-column label="组织" align="center" prop="organize" >
      <template #default="scope">
          <el-tag :type="scope.row.organize === '0' ? 'success': 'warning'" disable-transitions>{{ organizeFormat(scope.row) || '-- --' }}</el-tag>
      </template>
      </el-table-column>
      <el-table-column label="持卡" align="center" prop="name" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="卡号" align="center" prop="cardNo" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-popover  placement="left">
            <template #reference>
              <el-button type="primary" circle ><SvgIcon name="elementStar"/></el-button>
            </template>
            <div>
              <el-button text type="primary" v-auth="'custom:card:edit'" @click="onOpenEditModule(scope.row)">
                <SvgIcon name="elementEdit" />修改
              </el-button>
            </div>
            <div>
              <el-button text type="primary" v-auth="'custom:card:delete'" @click="onTabelRowDel(scope.row)">
                <SvgIcon name="elementDelete" />删除
              </el-button>
            </div>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页设置-->
    <div v-show="state.total > 0">
        <el-divider></el-divider>
        <el-pagination
            background
            :total="state.total"
            :current-page="state.queryParams.pageNum"
            :page-size="state.queryParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>
    </el-card>
    <!-- 添加或修改岗位对话框 -->
    <EditModule ref="editModuleRef" :title="state.title" />
  </div>
</template>

<script lang="ts" setup name="Card">
import {
  ref,
  toRefs,
  reactive,
  onMounted,
  getCurrentInstance,
  onUnmounted,
} from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { listCard, delCard } from "@/api/custom/card";
import EditModule from "./component/editModule.vue";

const { proxy } = getCurrentInstance() as any;
const editModuleRef = ref();
const state = reactive({
  // 遮罩层
  loading: true,
  // 选中数组
  ids: [],
  // 非单个禁用
  single: true,
  // 非多个禁用
  multiple: true,
  // 弹出层标题
  title: "",
  // 表格数据
  tableData: [],
  // 总条数
  total: 0,
  // organizeOptions字典数据
  organizeOptions: [],
  // 查询参数
  queryParams: {
    // 页码
    pageNum: 1,
    // 每页大小
    pageSize: 10,
    // 以下为参数
    title: undefined,
    expireAt: undefined,
    deleteTime: undefined,
    code: undefined,
    bank: undefined,
    organize: undefined,
    name: undefined,
    id: undefined,
    cardNo: undefined,
  },
});

/** 查询列表 */
const handleQuery = () => {
  state.loading = true;
  listCard(state.queryParams).then((response:any) => {
    state.tableData = response.data.data;
    state.total = response.data.total;
    state.loading = false;
  });
};
/** 重置按钮操作 */
const resetQuery = () => {
   state.queryParams.title = undefined;
   state.queryParams.expireAt = undefined;
   state.queryParams.deleteTime = undefined;
   state.queryParams.code = undefined;
   state.queryParams.bank = undefined;
   state.queryParams.organize = undefined;
   state.queryParams.name = undefined;
   state.queryParams.id = undefined;
   state.queryParams.cardNo = undefined;
  handleQuery();
};

const handleCurrentChange = (val:number) => {
  state.queryParams.pageNum = val
  handleQuery()
}
const handleSizeChange = (val:number) => {
  state.queryParams.pageSize = val
  handleQuery()
}
const organizeFormat = (row: any) => {
   return proxy.selectDictLabel(state.organizeOptions, row.organize);
};

// 打开新增弹窗
const onOpenAddModule = () => {
  state.title = "添加Card";
  editModuleRef.value.openDialog({});
};
// 打开编辑弹窗
const onOpenEditModule = (row: object) => {
  state.title = "修改Card";
  editModuleRef.value.openDialog(row);
};
/** 删除按钮操作 */
const onTabelRowDel = (row: any) => {
  const ids = row.id || state.ids;
  ElMessageBox({
    message: '是否确认删除编号为"' + ids + '"的数据项?',
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    return delCard(ids).then(() => {
      handleQuery();
      ElMessage.success("删除成功");
    });
  });
};
// 多选框选中数据
const handleSelectionChange = (selection: any) => {
  state.ids = selection.map((item: any) => item.id);
  state.single = selection.length != 1;
  state.multiple = !selection.length;
};
// 页面加载时
onMounted(() => {
  // 查询岗位信息
  handleQuery();
  proxy.getDicts("bank").then((response: any) => {
      state.organizeOptions = response.data;
  });

  proxy.mittBus.on("onEditCardModule", (res: any) => {
    handleQuery();
  });
});
// 页面卸载时
onUnmounted(() => {
  proxy.mittBus.off("onEditCardModule");
});
</script>
