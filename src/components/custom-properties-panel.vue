<template>
  <div class="containers" ref="content">
    <div class="canvas" ref="canvas"></div>
    <div class="button-row">

          <Button @click="downloadBpmn" class="button" type="success">
            保存BPMN
          </Button>
            <a hidden ref="downloadLink"></a>
          </div>
    <properties-view v-if="bpmnModeler" :modeler="bpmnModeler"></properties-view>

  </div>
</template>

<script>
// 引入相关的依赖
// import BpmnViewer from 'bpmn-js'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import PropertiesView from './custom-properties-panel/PropertiesView'

import { xmlStr } from '../mock/xmlStr'
export default {
  name: '',
  components: {
    PropertiesView
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 载入后, Vue 实例挂载到实际的 DOM 操作完成，一般在该过程进行 Ajax 交互
  mounted() {
    this.init()
  },
  data() {
    return {
      // bpmn建模器
      bpmnModeler: null,
      container: null,
      canvas: null
    }
  },
  // 方法集合
  methods: {
    init() {
      // 获取到属性ref为“content”的dom节点
      this.container = this.$refs.content
      // 获取到属性ref为“canvas”的dom节点
      const canvas = this.$refs.canvas
      // 建模
      this.bpmnModeler = new BpmnModeler({
        container: canvas
      })
      this.createNewDiagram()
    },
    createNewDiagram() {
      // 将字符串转换成图显示出来
      this.bpmnModeler.importXML(xmlStr, err => {
        if (err) {
          // console.error(err)
        } else {
          // 这里是成功之后的回调, 可以在这里做一系列事情
          this.success()
        }
      })
    },
    success() {
      // 给图绑定事件，当图有发生改变就会触发这个事件
      const that = this
      this.bpmnModeler.on('commandStack.changed', function() {
        that.saveDiagram(function(err, xml) {
          console.log(xml)
        })
      })
    },
    // 下载为bpmn格式,done是个函数，调用的时候传入的
    saveDiagram(done) {
      // 把传入的done再传给bpmn原型的saveXML函数调用
      this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
        //done(err, xml)
      })
    },
    downloadBpmn() {
        this.bpmnModeler.saveXML({
          format: true
        }, (err, xml) => {
          if (!err) {
            // 获取文件名
            const name = `${this.getFilename(xml)}.bpmn`;
            // 将文件名以及数据交给下载方法
            this.download({
              name: name,
              data: xml
            });
          }
        });
      },
  download({
    name = "diagram.bpmn",
    data
  }) {
    // 这里就获取到了之前设置的隐藏链接
    const downloadLink = this.$refs.downloadLink;
    // 把输就转换为URI，下载要用到的
    const encodedData = encodeURIComponent(data);

    if (data) {
      // 将数据给到链接
      downloadLink.href = "data:application/bpmn20-xml;charset=UTF-8," + encodedData;
      // 设置文件名
      downloadLink.download = name;
      // 触发点击事件开始下载
      downloadLink.click();
    }
  },
  getFilename(xml) {
    let start = xml.indexOf("process");
    let filename = xml.substr(start, xml.indexOf(">"));
    filename = filename.substr(filename.indexOf("id") + 4);
    filename = filename.substr(0, filename.indexOf('"'));
    return filename;
  }
  },
  // 计算属性
  computed: {}
}
</script>

<style scoped>
.containers {
  background-color: #ffffff;
  width: 100%;
  height: calc(100vh - 52px);
}
.canvas {
  width: 100%;
  height: 100%;
}
.panel {
  position: absolute;
  right: 0;
  top: 0;
  width: 300px;
}
</style>