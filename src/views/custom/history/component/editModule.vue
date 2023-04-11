<template>
  <div class="system-history-container">
    <el-dialog v-model="state.isShowDialog" width="769px" center>
      <template #title>
        <div style="font-size: large" v-drag="['.system-history-container .el-dialog', '.system-history-container .el-dialog__header']">{{title}}</div>
      </template>
      <el-form
        :model="state.ruleForm"
        :rules="state.ruleRules"
        ref="ruleFormRef"
        label-width="80px"
      >
      <el-form-item label="更新时间" prop="updatedAt">
          <el-date-picker clearable style="width: 200px"
                 v-model="state.ruleForm.updatedAt"
                 type="datetime"
                 placeholder="选择更新时间">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="持卡" prop="name">
          <el-input v-model="state.ruleForm.name" placeholder="请输入持卡" />
      </el-form-item>
      <el-form-item label="卡号" prop="cardNo">
          <el-input v-model="state.ruleForm.cardNo" placeholder="请输入卡号" />
      </el-form-item>
      <el-form-item label="名称" prop="title">
          <el-input v-model="state.ruleForm.title" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="识别码" prop="code">
          <el-input v-model="state.ruleForm.code" placeholder="请输入识别码" />
      </el-form-item>
      
       <el-form-item label="组织" prop="organize">
          <el-select v-model="state.ruleForm.organize" placeholder="请选择组织">
              <el-option
                  v-for="dict in state.organizeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
              >{{ dict.dictLabel }}</el-option>
          </el-select>
       </el-form-item>
      
      
       <el-form-item label="银行" prop="bank">
          <el-select v-model="state.ruleForm.bank" placeholder="请选择银行">
              <el-option
                  v-for="dict in state.bankOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
              >{{ dict.dictLabel }}</el-option>
          </el-select>
       </el-form-item>
      
      <el-form-item label="过期时间" prop="expireAt">
          <el-date-picker clearable style="width: 200px"
                 v-model="state.ruleForm.expireAt"
                 type="datetime"
                 placeholder="选择过期时间">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
          <el-input v-model="state.ruleForm.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="创建时间" prop="createdAt">
          <el-date-picker clearable style="width: 200px"
                 v-model="state.ruleForm.createdAt"
                 type="datetime"
                 placeholder="选择创建时间">
          </el-date-picker>
      </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取 消</el-button>
          <el-button type="primary" @click="onSubmit" :loading="state.loading">编 辑</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="editHistory">
import { reactive, toRefs, ref, unref, getCurrentInstance } from "vue";
import { updateHistory, addHistory } from "@/api/custom/history";
import { ElMessage } from "element-plus";

const props = defineProps({
  title: {
    type: String,
    default: () => "",
  },
})

const { proxy } = getCurrentInstance() as any;
const ruleFormRef = ref<HTMLElement | null>(null);
const state = reactive({
  // 是否显示弹出层
  isShowDialog: false,
  loading: false,
  ruleForm: {
  updatedAt: undefined,
  name: "",
  cardNo: "",
  title: "",
  id: undefined,
  code: "",
  organize: "",
  bank: "",
  expireAt: undefined,
  remark: "",
  createdAt: undefined,
  },
  // organizeOptions字典数据
  organizeOptions: [],
  // bankOptions字典数据
  bankOptions: [],
  // 表单校验
  ruleRules: {
    name: [
      { required: true, message: "持卡不能为空", trigger: "blur" }
    ],
  },
});
// 打开弹窗
const openDialog = (row: any) => {
  state.ruleForm = JSON.parse(JSON.stringify(row));

  state.isShowDialog = true;
  state.loading = false;
 proxy.getDicts("organize").then((response: any) => {
     state.organizeOptions = response.data;
 });
 proxy.getDicts("bank").then((response: any) => {
     state.bankOptions = response.data;
 });
}

// 关闭弹窗
const closeDialog = (row?: object) => {
  proxy.mittBus.emit("onEditHistoryModule", row);
  state.isShowDialog = false;
};
// 取消
const onCancel = () => {
  closeDialog();
};

// 保存
const onSubmit = () => {
  const formWrap = unref(ruleFormRef) as any;
  if (!formWrap) return;
  formWrap.validate((valid: boolean) => {
    if (valid) {
      state.loading = true;
      if (state.ruleForm.id != undefined && state.ruleForm.id != 0) {
        updateHistory(state.ruleForm).then((response) => {
          ElMessage.success("修改成功");
          state.loading = false;
          closeDialog(state.ruleForm); // 关闭弹窗
        });
      } else {
        addHistory(state.ruleForm).then((response) => {
          ElMessage.success("新增成功");
          closeDialog(state.ruleForm); // 关闭弹窗
        });
      }
    }
  });
};

defineExpose({
  openDialog,
});
</script>
