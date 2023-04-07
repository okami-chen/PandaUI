<template>
  <div class="system-card-container">
    <el-dialog v-model="state.isShowDialog" width="769px" center>
      <template #title>
        <div style="font-size: large" v-drag="['.system-card-container .el-dialog', '.system-card-container .el-dialog__header']">{{title}}</div>
      </template>
      <el-form
        :model="state.ruleForm"
        :rules="state.ruleRules"
        ref="ruleFormRef"
        label-width="80px"
      >
      <el-form-item label="名称" prop="title">
          <el-input v-model="state.ruleForm.title" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="过期时间" prop="expireAt">
          <el-date-picker clearable style="width: 200px"
                 v-model="state.ruleForm.expireAt"
                 type="datetime"
                 placeholder="选择过期时间">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="识别码" prop="code">
          <el-input v-model="state.ruleForm.code" placeholder="请输入识别码" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
          <el-input v-model="state.ruleForm.remark" placeholder="请输入备注" />
      </el-form-item>
      
      <el-form-item label="组织" prop="organize">
          <el-input v-model="state.ruleForm.organize" placeholder="请输入组织" />
      </el-form-item>
      <el-form-item label="持卡" prop="name">
          <el-input v-model="state.ruleForm.name" placeholder="请输入持卡" />
      </el-form-item>
      <el-form-item label="卡号" prop="cardNo">
          <el-input v-model="state.ruleForm.cardNo" placeholder="请输入卡号" />
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

<script lang="ts" setup name="editCard">
import { reactive, toRefs, ref, unref, getCurrentInstance } from "vue";
import { updateCard, addCard } from "@/api/suctom/card";
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
  title: "",
  expireAt: undefined,
  deleteTime: undefined,
  code: "",
  remark: "",
  bank: "",
  organize: "",
  name: "",
  id: undefined,
  cardNo: "",
  },
  // organizeOptions字典数据
  organizeOptions: [],
  // 表单校验
  ruleRules: {
    bank: [
      { required: true, message: "银行不能为空", trigger: "blur" }
    ],
    organize: [
      { required: true, message: "组织不能为空", trigger: "blur" }
    ],
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
 proxy.getDicts("bank").then((response: any) => {
     state.organizeOptions = response.data;
 });
}

// 关闭弹窗
const closeDialog = (row?: object) => {
  proxy.mittBus.emit("onEditCardModule", row);
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
        updateCard(state.ruleForm).then((response) => {
          ElMessage.success("修改成功");
          state.loading = false;
          closeDialog(state.ruleForm); // 关闭弹窗
        });
      } else {
        addCard(state.ruleForm).then((response) => {
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
