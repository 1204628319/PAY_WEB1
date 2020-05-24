<template>
  <div ref="excel-upload">
    <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      {{ tip }}
      <el-button :loading="loading" class="excel-upload-button" type="primary" @click="handleUpload">
        点击上传
      </el-button>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'

export default {
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function// eslint-disable-line
  },
  data() {
    return {
      loading: false,
      excelData: {
        header: null,
        results: null
      },
      tip: '将文件拖放到这里或者点击上传'
    }
  },
  methods: {
    generateData({ header, results }) {
      this.excelData.header = header
      this.excelData.results = results
      this.onSuccess && this.onSuccess(this.excelData)
    },
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) return
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        this.$message.error('仅支持上传一个文件!')
        return
      }
      const rawFile = files[0]

      if (!this.isExcel(rawFile)) {
        this.$message.error('仅支持上传 .xlsx, .xls, .csv 类型的文件')
        return false
      }
      this.upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    handleUpload() {
      this.$refs['excel-upload-input'].click()
    },
    handleClick(e) {
      const files = e.target.files
      const rawFile = files[0]
      if (!rawFile) return
      this.upload(rawFile)
    },
    upload(rawFile) {
      this.tip = rawFile.name
      this.$refs['excel-upload-input'].value = null

      if (!this.beforeUpload) {
        this.readerData(rawFile)
        return
      }
      const before = this.beforeUpload(rawFile)
      if (before) {
        this.readerData(rawFile)
      }
    },
    readerData(rawFile) {
      this.loading = true
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = this.getHeaderRow(worksheet)
          const results = XLSX.utils.sheet_to_json(worksheet)
          this.generateData({ header, results })
          this.loading = false
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) {
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        let hdr = 'UNKNOWN ' + C
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>

<style scoped>
.excel-upload-input{
  display: none;
  z-index: -9999;
}
.excel-upload-button{
  margin-left: 16px;
  border-radius: 0 6px 6px 0;
  background: #f2f5f9;
  color: #333;
  border-left: 1px solid #c9c9c9;
  margin-top: -0.5px;
  margin-left:16px;
}
.drop{
  border: 1px solid #c9c9c9;
  width: 583Px;
  height: 40px;
  line-height: 40px;
  margin: 0 auto;
  font-size: 14px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 0 0 0 20px;
}
</style>
