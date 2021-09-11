<template>
  <div>
    <div>
      <button class="upload_button text-xs" @click="dl">
        QRコードをダウンロード
      </button>
    </div>
    <div v-show="false">
      <vue-qrcode
        id="QR"
        v-if="url"
        :value="url"
        :options="option"
        tag="img"
      ></vue-qrcode>
    </div>
  </div>
</template>

<script>
import VueQrcode from "@chenfengyuan/vue-qrcode";
export default {
  name: "QRCode",
  components: {
    VueQrcode,
  },
  props: {
    url: String,
    QRCodeTitle: String,
  },
  data() {
    return {
      targetText: "https://github.com/maru0pengin/MachigaeSagashiMaker",
      option: {
        errorCorrectionLevel: "M",
        maskPattern: 0,
        margin: 10,
        scale: 2,
        width: 300,
        color: {
          dark: "#000000FF",
          light: "#FFFFFFFF",
        },
      },
    };
  },
  methods: {
    dl() {
      // img要素としてQRコードを取得
      const img = document.getElementById("QR");
      if (img) {
        // img要素のurlを取得(base64)
        let url = img.src;
        // a要素を作成
        let link = document.createElement("a");
        // a要素のリンク先をimg要素のurlに指定
        link.href = url;
        link.download = `${this.QRCodeTitle}.png`;
        link.click();
      }
    },
  },
};
</script>
<style scoped>
</style>