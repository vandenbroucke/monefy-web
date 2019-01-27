<script>
  //Importing Line and mixins class from the vue-chartjs wrapper
  import {Doughnut, mixins} from 'vue-chartjs'
  //Getting the reactiveProp mixin from the mixins module.
  const { reactiveProp } = mixins
  
  export default{
    mixins: [reactiveProp,Doughnut],
    data () {
      return {
        options: {
            responsive:true,
            animation: {
              easing:"easeOutExpo"
            },
            legend: {
              labels: {
                fontColor: '#ddd'
              }
            }
          }
      }
    },
    mounted () {
      this.renderChart(this.chartData, this.options)
    }
  }
</script>