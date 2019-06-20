<script>
  //Importing Line and mixins class from the vue-chartjs wrapper
  import {Bar, mixins} from 'vue-chartjs'
import chart from '../js/helpers/chart';
  //Getting the reactiveProp mixin from the mixins module.
  const { reactiveProp } = mixins
  export default{
    mixins: [reactiveProp,Bar],
    data () {
      return {        
        options: {         
          onClick:this.handle_click,            
          title:{
            display:0
          },
          legend: {
            display: false,
          },
          scales:{
            xAxes:[{
              ticks: {
                  autoSkip:false,
                  fontColor: "rgba(255,255,255,0.45)"
              }
            }],
            yAxes:[{
              ticks: {
                fontColor: "rgba(255,255,255,0.45)"
              }
            }]
          },
          xAxes:[{
              ticks: {
                  stepSize: 1,
                  min: 0
              }
          }],
          responsive:true,
          animation: {
            easing:"easeOutExpo"
          },
          legend: {
            display:false
          }
        }
      }
    },
    methods:{
      handle_click(e,b){
        if(b!==undefined && b[0] !== undefined){
          let chart_element = b[0];
          this.$emit('on_select_label',chart_element._model.label);           
        }
      }
    },
    mounted () {
      // this.chartData is created in the mixin and contains all the data needed to build the chart.
      this.renderChart(this.chartData, this.options)
    }
  }
</script>