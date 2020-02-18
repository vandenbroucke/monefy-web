<template>
  <section id="section_import">
    <div id="modal_how_import" class="uk-flex-top" uk-modal>
      <div class="uk-modal-dialog uk-margin-auto-vertical">
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <div class="uk-modal-header">
          <h2 class="uk-modal-title">Where can I find the monefy .CSV file?</h2>
        </div>
        <div class="uk-modal-body">
          <p>In your Monefy app, tap the menu button (3 dots). Next, select settings and scroll down untill you find "Export to file". You can then save this file locally or export it to services like DropBox. This way you'll be able to drag and drop your file while on desktop.</p>

          <img
            data-src="img/screen_export.jpg"
            width="60%"
            height
            alt
            uk-img
            class="uk-margin-auto uk-display-block"
          />
        </div>
      </div>
    </div>

    <div class="uk-position-center center-display">
      <video width="500" autoplay loop muted>
        <source src="/monefy-web/img/v.webm" type="video/webm" />Sorry, your browser doesn't support embedded videos.
      </video>
      <h1 class="main_title">Monefy-web</h1>
      <h2>An unofficial open-source web layer for Monefy.</h2>

      <span uk-icon="icon:pull;ratio:3;" class="pull-icon">
        <input type="file" accept=".csv" class="input-file" @change="handleFiles" />
      </span>

      <h3>Drag &amp; Drop your Monefy .csv file here, or tap the icon.</h3>

      <div uk-spinner class="uk-position-center" v-if="isProcessingInput"></div>
    </div>

    <div class="overlay"></div>

    <div class="uk-position-bottom-center">
      <footer class="uk-margin-bottom">
        <a
          uk-toggle
          href="#modal_how_import"
          title="What is the monefy .csv file?"
          class="uk-button uk-button-default uk-button-small uk-margin-bottom"
        >.CSV file?</a>
        <div class="uk-margin-bottom">
          By using this application your data will
          <b>not</b> be uploaded to any online service. The application runs purely locally on your device.
          For now, we only support single currency usage.
        </div>
        <a
          class="github-button uk-position-center"
          href="https://github.com/vandenbroucke/monefy-web"
          data-size="large"
          data-show-count="true"
          aria-label="Star vandenbroucke/monefy-web on GitHub"
        >Star</a>
      </footer>
    </div>
  </section>
</template>
<script>
import Vue from "vue";
import Papa from "papaparse";
import moment from "moment";

export default {
  data() {
    return {
      isProcessingInput: false
    };
  },
  methods: {
    handleFiles: function(e) {
      const vm = this;
      try {
        //If files were selected, use the first one and parse it.
        if (e.target.files[0]) {
          Papa.parse(e.target.files[0], {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: function(res) {
              vm.isProcessingInput = true;
              let rawRead = vm.handleCommaAndDate(res.data);
              //Set raw data in Vuex store for later use in other components
              vm.$store.dispatch("set_raw_data", rawRead);
              //Go to the dashboard view
              vm.$router.push("/dash");
            }
          });
        }
      } catch (ex) {
        console.log(ex);
      }
    },
    handleCommaAndDate(JSONData) {
      //For every json object, handle its amount (fix float) and date (parse date)
      JSONData.forEach(function(el, idx) {
        if (typeof JSONData[idx].amount == "string") {
          JSONData[idx].amount = parseFloat(
            //replace commas and spaces
            JSONData[idx].amount.replace(/[,\s]/g, "")
          );
        }
        JSONData[idx].date = moment(JSONData[idx].date, "DD/MM/YYYY").toDate();
      });
      console.log(JSONData);
      return JSONData;
    }
  }
};
</script>