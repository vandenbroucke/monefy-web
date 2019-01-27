import randomColor from 'randomcolor'
/**
 * ChartHelper provides plugins, methods and data transformations to directly plug data into ChartJS charts.
 */
export default{

/**
 * Generates a ChartJS plugin that enables bi-colored timeline charts
 * @param {string} input_color_top Color that's shown above the X-axis of a timeline graph
 * @param {string} input_color_bottom Color that's shown below the X-axis of a timeline graph
 */
    get_bicolor_plugin(input_color_top,input_color_bottom){

        let plugin = {
            beforeRender: function (x, options) {
                let chart = x.chart,
                    dataset = x.data.datasets[0],
                    y_scale = x.scales['y-axis-0'],
                    y_position = y_scale.getPixelForValue(0),
                    center_position = y_position / chart.height,
                    gradientFill = chart.ctx.createLinearGradient(0, 0, 0, chart.height);
                gradientFill.addColorStop(0, input_color_top);
                gradientFill.addColorStop(center_position, input_color_top);
                gradientFill.addColorStop(center_position, input_color_bottom);
                gradientFill.addColorStop(1, input_color_bottom);
                x.data.datasets[0]._meta[Object.keys(dataset._meta)[0]].dataset._model.backgroundColor = gradientFill;
            }};

        return [plugin];
    },
    /**
     * Given a set of raw records, create a cumulative chart dataset
     * @param {Array} input_records Array of raw monefy records
     */
    prepare_cumulative_timelime_data(input_records){
        let cumulative_data=[],
            sum =0;
                
        for(var i = 0 ; i < input_records.length;i++){   
            sum += input_records[i].amount;            
            cumulative_data.push({
                x:input_records[i].date,
                y:sum.toFixed(2)                      
            });                  
        }
        return cumulative_data;
    },

    /**
     * Splits categories into cost and income
     * @param {Array} input_categories Array of categories and their totals 
     */    
    prepare_barchart_cost_income_data(input_categories){  
        let costs = {
            data:[],
            labels:[],
            colors:[]
        },
        income = {
            data:[],
            labels:[],
            colors:[]
        };
        console.log("input_categories");
        console.log(input_categories);
        let sorted_categories = input_categories.sort(function(a,b){
           return (Math.abs(a.sum) - Math.abs(b.sum));
        })
        
        console.log(sorted_categories);
        function pushCategory(type,name,sum,color){
            type.data.push(sum);
            type.labels.push(name);
            type.colors.push(color);
        }
        sorted_categories.forEach(function(category){  
            pushCategory((category.isExpense)?costs:income,category.category,Math.abs(category.sum),randomColor());
        });  
        return [costs,income];
    },
    /**
     * Format data to insert into vuecharts timeline
     * @param {Array} input_data Array of {x,y} objects (x:time, y: value)
     */
    format_chartdata_timeline_balance(input_data){    
        return{
            datasets:[{
                data:input_data,
                fill:'origin',
                borderColor:"rgba(255,255,255,.5)"                       
            }]
        }; 
    },
    
    /**
     * Format dat to insert into vuecharts bartchar
     * @param {*} input_data Array of numerical values to be displayed on bar chart
     * @param {*} colors Colors associated with the input data
     * @param {*} labels Labels associated with the input data
     */
    format_chartdata_barchart(input_data,colors,labels){
        return {           
            datasets: [{
                legend:{},
                data: input_data,
                backgroundColor: colors
            }],
            labels: labels          
        };
    }
}               
