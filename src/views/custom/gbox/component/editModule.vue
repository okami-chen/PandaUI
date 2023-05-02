<template>
  <div class="system-gbox-container">
    <el-dialog v-model="state.isShowDialog" width="769px" center>
      <template #title>
        <div style="font-size: large" v-drag="['.system-gbox-container .el-dialog', '.system-gbox-container .el-dialog__header']">{{title}}</div>
      </template>
      <el-form
        :model="state.ruleForm"
        :rules="state.ruleRules"
        ref="ruleFormRef"
        label-width="80px"
      >
        <el-form-item label="应用分类" prop="appCateIndex">
            <el-input v-model="state.ruleForm.appCateIndex" placeholder="请输入应用分类" />
        </el-form-item>
        <el-form-item label="应用名称" prop="appName">
            <el-input v-model="state.ruleForm.appName" placeholder="请输入应用名称" />
        </el-form-item>
        <el-form-item label="应用版本" prop="appVersion">
            <el-input v-model="state.ruleForm.appVersion" placeholder="请输入应用版本" />
        </el-form-item>
        <el-form-item label="应用图片" prop="appImage">
            <el-input v-model="state.ruleForm.appImage" placeholder="请输入应用图片" />
        </el-form-item>
        <el-form-item label="应用链接" prop="appPackage">
            <el-input v-model="state.ruleForm.appPackage" placeholder="请输入应用链接" />
        </el-form-item>
        <el-form-item label="应用描述" prop="appDescription">
            <el-input v-model="state.ruleForm.appDescription" type="textarea" placeholder="请输入应用描述" :rows="8"/>
        </el-form-item>
      <el-form-item label="更新时间" prop="appUpdateTime">
          <el-date-picker clearable style="width: 230px" 
                 v-model="state.ruleForm.appUpdateTime"
                 type="datetime"
                 placeholder="选择更新时间">
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

<script lang="ts" setup name="editGbox">
import { reactive, toRefs, ref, unref, getCurrentInstance } from "vue";
import { updateGbox, addGbox } from "@/api/custom/gbox";
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
  appType: "",
  appUpdateTime: undefined,
  id: undefined,
  appImage: "",
  appDescription: "",
  appPackage: "",
  appVersion: "",
  appCateIndex: undefined,
  appName: "",
  },
  // 表单校验
  ruleRules: {
    appName: [
      { required: true, message: "应用名称不能为空", trigger: "blur" }
    ],
  },
});
// 打开弹窗
const openDialog = (row: any) => {
  state.ruleForm = JSON.parse(JSON.stringify(row));

  state.isShowDialog = true;
  state.loading = false;
}

// 关闭弹窗
const closeDialog = (row?: object) => {
  proxy.mittBus.emit("onEditGboxModule", row);
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
        updateGbox(state.ruleForm).then((response) => {
          ElMessage.success("修改成功");
          state.loading = false;
          closeDialog(state.ruleForm); // 关闭弹窗
        });
      } else {
        addGbox(state.ruleForm).then((response) => {
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
