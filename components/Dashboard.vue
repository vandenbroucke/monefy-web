<template>
    <section id="dashboard">
        <div class="uk-grid uk-padding uk-grid-small uk-container" uk-grid>
            <div class=uk-width-1-1@m>
                <div class="uk-card uk-card-default uk-card-body card uk-padding-small card-chart">          
                      <date-picker v-model="filter_values.date_range" :range="true" :confirm="true" :clearable="true" v-on:change="filters_dates_on_change" :lang="options.filters_daterange_lang" :shortcuts="options.shortcuts"></date-picker>
                    <div class="chart-container-timeline">                            
                        <reactive-time-line :chart-data="charts.data.timeline_balance" :plugins="charts.plugins.timeline_bicolor"></reactive-time-line> 
                    </div>                 
                                                     
                </div>                   
            </div>
            <div class=uk-width-1-4@m>
                <div class="uk-card uk-card-default uk-card-body card uk-padding-small card-chart">        
                    <h3 class="inline_block">Analysis</h3>       

                    <table class="uk-table uk-table-striped uk-margin-remove-top uk-table-small analysis-table">
                        <tbody>
                            <tr>
                                <td class="uk-text-bold">Balance over period</td>
                                <td>{{(metrics.balance).toFixed(2)}}</td>
                            </tr>
                            <tr>
                                <td class="uk-text-bold">Est. Costs (D/M/Y)</td>
                                <td>{{"(" + (metrics.daily.costs).toFixed(2) + " / " + (metrics.daily.costs*30).toFixed(2)+ " / " + (metrics.daily.costs*365).toFixed(2)+")"}}</td>
                            </tr>
                            <tr>
                                <td class="uk-text-bold">Est. Income (D/M/Y)</td>
                                <td>{{"(" + (metrics.daily.income).toFixed(2) + " / " + (metrics.daily.income*30).toFixed(2)+ " / " + (metrics.daily.income*365).toFixed(2)+")"}}</td>
                            </tr>
                            <tr>
                                <td class="uk-text-bold">Savings (D/M/Y)</td>
                                <td>{{"(" + (metrics.savings.daily).toFixed(2) + " / " + (metrics.savings.monthly).toFixed(2)+ " / " + (metrics.savings.yearly).toFixed(2)+")"}}</td>
                            </tr>
                            <tr>
                                <td class="uk-text-bold">Projections (1Y/3Y/5Y/10Y)</td>
                                <td>{{"(" + (metrics.savings.yearly).toFixed(2) + " / " + (metrics.savings.yearly*3).toFixed(2)+ " / " + (metrics.savings.yearly*5).toFixed(2)+"/"+(metrics.savings.yearly*10).toFixed(2)+")"}}</td>
                            </tr>                                                     
                        </tbody>
                    </table>             
                </div>                   
            </div>   
            <div class=uk-width-1-4@m>
                <div class="uk-card uk-card-default uk-card-body card uk-padding-small card-chart clickable">    
                    <h3 class="inline_block">Costs</h3>   
                    <span class="balance_indicator cost">{{metrics.costs | filter_round_float}}</span>   
                    <div class="uk-padding uk-padding-remove">                                                              
                        <reactive-bar :chart-data="charts.data.bar_costs" @on_select_label="filters_records_by_label"></reactive-bar>                   
                    </div>                                  
                </div>                   
            </div>
            <div class=uk-width-1-4@m>
                <div class="uk-card uk-card-default uk-card-body card uk-padding-small card-chart clickable">        
                    <h3 class="inline_block">Income</h3>                            
                    <span class="balance_indicator income">{{metrics.income | filter_round_float}}</span>           
                    <div class="uk-padding uk-padding-remove">                                                             
                        <reactive-bar :chart-data="charts.data.bar_income" @on_select_label="filters_records_by_label"></reactive-bar>                   
                    </div>                                  
                </div>                   
            </div>
            
            <div class=uk-width-1-4@m>
                <div class="uk-card uk-card-default uk-card-body card uk-padding-small record_list ">        
                    <h3 class="inline_block">Records <span class="uk-text-meta">({{ filter_values.category || "select from barchart"}})</span></h3> 
                    <table class="uk-table uk-table-striped uk-margin-remove-top" v-if="filter_values.category">
                        <tbody>
                            <tr v-for="record in filtered.records_by_category[filter_values.category]">
                                <td class="uk-text-meta">{{record.date | filter_date_format}}</td>
                                <td>{{record.description}}</td>
                                <td class="uk-text-bold">{{record.amount}}</td>
                            </tr>
                        </tbody>
                    </table>                                           
                </div>                   
            </div>
            <div class="uk-width-1-2@m">
                <div class="uk-card uk-card-default uk-card-body card uk-padding-small comparison_list">        
                    <h3 class="inline_block">Comparison</h3> 
                    <table class="uk-table uk-margin-remove-top uk-table-striped uk-margin-remove-top uk-table-small">
                        <tbody>
                            <tr>
                                <th></th>
                                <th colspan="3" class="odd">
                                    <span uk-icon="icon: minus" class="uk-float-left" v-on:click="update_year_filter('comparison_year_one',-1)" ></span>
                                    {{comparison_year_one}} 
                                    <span uk-icon="icon: plus" class="uk-float-right" v-on:click="update_year_filter('comparison_year_one',1)" ></span>
                                </th>
                                <th colspan="3">
                                    <span uk-icon="icon: minus" class="uk-float-left" v-on:click="update_year_filter('comparison_year_two',-1)" ></span>
                                     {{comparison_year_two}} 
                                    <span uk-icon="icon: plus" class="uk-float-right" v-on:click="update_year_filter('comparison_year_two',1)"></span>
                                </th>
                                <th></th>
                            </tr>
                            <tr>
                                <th title="Month">M</th>
                                <th title="Cost">C</th>
                                <th title="Income">I</th>
                                <th title="Balance">B</th>
                                <th title="Cost">C</th>
                                <th title="Income">I</th>
                                <th title="Balance">B</th>
                                <th title="Difference">D</th>
                            </tr>
                            


                            <tr v-for="month in months">
                                <td>{{month}}</td>
                                <td>{{preprocessed.raw_metrics_per_year_per_month[comparison_year_one][month].cost.toFixed(1) }}</td>
                                <td>{{preprocessed.raw_metrics_per_year_per_month[comparison_year_one][month].income.toFixed(1) }}</td>
                                <td>{{preprocessed.raw_metrics_per_year_per_month[comparison_year_one][month].balance.toFixed(1)  }}</td>
                                <td>{{preprocessed.raw_metrics_per_year_per_month[comparison_year_two][month].cost.toFixed(1) }}</td>
                                <td>{{preprocessed.raw_metrics_per_year_per_month[comparison_year_two][month].income.toFixed(1) }}</td>
                                <td>{{preprocessed.raw_metrics_per_year_per_month[comparison_year_two][month].balance.toFixed(1) }}</td>
                                <td
                                     v-bind:class="[(preprocessed.raw_metrics_per_year_per_month[comparison_year_two][month].balance - preprocessed.raw_metrics_per_year_per_month[comparison_year_one][month].balance).toFixed(1) < 0 ? 'table_red' : 'table_green']"
                                
                                >{{(preprocessed.raw_metrics_per_year_per_month[comparison_year_two][month].balance - preprocessed.raw_metrics_per_year_per_month[comparison_year_one][month].balance).toFixed(1) }}</td>

                            </tr>
                            
                        </tbody>
                    </table>                                                              
                </div>                   
            </div>
               <div class=uk-width-1-2@m>
                <div class="uk-card uk-card-default uk-card-body card uk-padding-small card-chart">       
                    <h3 class="inline_block">Category timeline <span class="uk-text-meta">({{ filter_values.category || "select from barchart"}})</span></h3>
                    <span class="uk-text-meta" v-if="filter_values.category">{{selected_category_stats}}</span>
                    <div class="chart-container-timeline" v-if="filter_values.category">                            
                        <reactive-time-line :chart-data="selected_category_timeline_data"></reactive-time-line>
                    </div>                 
                                                     
                </div>                   
            </div>                
    </div>
    </section>
</template>
<script>
import Vue from 'vue'
import reactiveBar from './reactiveBar.vue'
import reactiveTimeLine from './reactiveTimeLine.vue'
import DatePicker from 'vue2-datepicker'
import moment from 'moment'
import ChartHelper from '../js/helpers/chart.js'
import ParserHelper from '../js/helpers/parser.js'
import FinanceHelper from '../js/helpers/finance.js'

const day_ms = 86400000;
const today_ms = new Date().getTime();

export default{
    components:{
        reactiveBar,
        reactiveTimeLine,
        DatePicker       
    },
    data(){
        return{         
            //Charts tools, plugins & data    
            charts:{
                data:{
                    timeline_balance:{},
                    bar_costs:{},
                    bar_income:{}
                },
                plugins:{
                    timeline_bicolor:ChartHelper.get_bicolor_plugin('rgba(0,255,0,0.5)','rgba(255,0,0,0.5)'),
                }
            },
            filtered:{
                records_by_category:{}
            },            
            comparison_year_one:2018,
            comparison_year_two:2019,
            preprocessed:{
                raw_timeline_balance:{},
                raw_records_by_category:{},
                raw_category_totals:[]
            },
            //Options for components
            options:{
                filters_daterange_lang:"en",
                shortcuts:[
                    {text:"Last 7 days",
                     start:today_ms - 7*day_ms,
                     end:today_ms},
                     {text:"Last 31 days",
                     start:today_ms - 31*day_ms,
                     end:today_ms},
                     {text:"Last 365 days",
                     start:today_ms - 365*day_ms,
                     end:today_ms}
                ]
            },
            //Metrics that are directly displayed
            metrics:{},
            filter_values:{
                date_range:"",
                category:""
            },
            months:[0,1,2,3,4,5,6,7,8,9,10,11]            
        };
    },
    methods:{         
        
        update_year_filter(comparison_year, modifier){
            let new_year_value = this[comparison_year] + modifier;
            if(new_year_value >1990 && new_year_value < new Date().getUTCFullYear()+1) this[comparison_year] = new_year_value;
        },


        /**
         * Given a change in time range, update the visualized data.
         * @param {Array} dates An array consisting out of 2 dates representing a time range, [0]: minimum, [0]:maximum
         */
        filters_dates_on_change(dates){           
            if(dates[0]==null || dates[1]==null){      
                this.metrics =  FinanceHelper.generate_metrics_from_records(this.$store.getters.rawData);
                let [costs,income] = ChartHelper.prepare_barchart_cost_income_data(this.preprocessed.raw_category_totals);
                this.charts.data.timeline_balance = ChartHelper.format_chartdata_timeline_balance(this.preprocessed.raw_timeline_balance);
                this.charts.data.bar_costs = ChartHelper.format_chartdata_barchart(costs.data,costs.colors,costs.labels);
                this.charts.data.bar_income = ChartHelper.format_chartdata_barchart(income.data,income.colors,income.labels);
                this.filter.records_by_category = this.preprocessed.raw_records_by_category;
                
            }
            else{
                let min=dates[0].getTime(),
                    max=dates[1].getTime();        
                //filter timeline & bar data
                let filtered_records = this.$store.getters.rawData.filter(function(record){
                    let record_ms = record.date.getTime();
                    return (record_ms >= min && record_ms <= max);
                });
                let filtered_timeline_data = this.preprocessed.raw_timeline_balance.filter(function(record){
                    let record_ms = record.x.getTime();
                    return (record_ms >= min && record_ms <= max);
                });
                
                this.metrics =  FinanceHelper.generate_metrics_from_records(filtered_records);
                let filtered_records_by_category = ParserHelper.group_array_by_key(filtered_records,"category");   
                let filtered_category_totals = FinanceHelper.sum_categories_by_property(filtered_records_by_category,"amount");  
                let [costs,income] = ChartHelper.prepare_barchart_cost_income_data(filtered_category_totals);

                this.filtered.records_by_category = filtered_records_by_category;
                this.charts.data.timeline_balance = ChartHelper.format_chartdata_timeline_balance(filtered_timeline_data);
                this.charts.data.bar_costs = ChartHelper.format_chartdata_barchart(costs.data,costs.colors,costs.labels);
                this.charts.data.bar_income = ChartHelper.format_chartdata_barchart(income.data,income.colors,income.labels);
            }
            return true;
        },  
        filters_records_by_label(label){
            this.filter_values.category = label;
        },        
        process_raw_records(input_records){    
            this.preprocessed.raw_timeline_balance = ChartHelper.prepare_cumulative_timelime_data(input_records);
            this.preprocessed.raw_records_by_category = ParserHelper.group_array_by_key(input_records,"category");   
            this.preprocessed.raw_category_totals = FinanceHelper.sum_categories_by_property(this.preprocessed.raw_records_by_category,"amount");
            //Generate cost and incomes of all years on monthly basis, this only occurs once, on the load of the input data
            this.preprocessed.raw_metrics_per_year_per_month = FinanceHelper.get_year_month_total_metrics(input_records,2018,2019);
        }          
    },
    created(){
        this.process_raw_records(this.$store.getters.rawData);
        this.filtered.records_by_category = this.preprocessed.raw_records_by_category;
        this.metrics =  FinanceHelper.generate_metrics_from_records(this.$store.getters.rawData);
        let [costs,income] = ChartHelper.prepare_barchart_cost_income_data(this.preprocessed.raw_category_totals);
        this.charts.data.timeline_balance = ChartHelper.format_chartdata_timeline_balance(this.preprocessed.raw_timeline_balance);
        this.charts.data.bar_costs = ChartHelper.format_chartdata_barchart(costs.data,costs.colors,costs.labels);
        this.charts.data.bar_income = ChartHelper.format_chartdata_barchart(income.data,income.colors,income.labels);
    },
    computed:{
        selected_category_timeline_data(){        
            return ChartHelper.format_chartdata_timeline_balance(ChartHelper.prepare_cumulative_timelime_data(this.filtered.records_by_category[this.filter_values.category]));;
        },
        selected_category_stats(){      
            if(this.filter_values.date_range.length == 2 && this.filter_values.date_range[0] && this.filter_values.date_range[1] && this.filter_values.category){
                let days = Math.round(Math.abs(this.filter_values.date_range[0].getTime()-this.filter_values.date_range[1].getTime())/86400000);                
                let records_by_selected_category = this.filtered.records_by_category[this.filter_values.category];
                let total = 0;
                if(records_by_selected_category == undefined)
                {
                    return "";   
                }
                else
                {
                    for(var i=0;i<records_by_selected_category.length;i++){
                        total+=records_by_selected_category[i].amount;
                    }
                    let perDay = total/days;    
                    return "("+parseFloat(perDay).toFixed(1)+"/D, "+parseFloat(perDay*31).toFixed(1) +"/M, "+ parseFloat(perDay*365).toFixed(1) +"/Y)"
                }

                
            }
            else{
                return ""
            }
        }

    },
    filters:{
        filter_round_float(input){
            return input.toFixed(2);
        },
        filter_date_format(input){
            return moment(input).format("DD/MM/YY");
        }
    }
}
</script>