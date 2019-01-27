<script>
  import {Line, mixins} from 'vue-chartjs'
  import moment from 'moment'
  const { reactiveProp } = mixins
  
  export default{
    mixins: [reactiveProp,Line],
    data () {
      return {
        options: {
            responsive:true,
            animation: {
              easing:"easeOutExpo"
            },
          	maintainAspectRatio:!1, legend: {
              display: !1
            }
            ,scales: {
              yAxes:[ { ticks: {
                  display:0,
                  fontColor: "rgba(255,255,255,0.5)", fontStyle: "bold", beginAtZero: !0, maxTicksLimit: 10, padding: 0
                },                
                gridLines: {
                  drawTicks: !1, display: !1 
                }
              }
              ], xAxes:[ {
                  type: 'time',
                  time:{
                    parser: 'DD/MM/YYYY'
                  },
                  ticks: {
                  padding: -20, fontColor: "rgba(255,255,255,0.2)", fontStyle: "bold",
                  data:'source'
                }
              }
              ]
            }
          }
      }
    },
    mounted () {
      this.renderChart(this.chartData, this.options);     
    }
  }
</script>