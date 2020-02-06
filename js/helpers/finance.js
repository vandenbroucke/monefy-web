/**
 * FinanceHelper provides data transformations related to the manipulation of financial data.
 */
export default{
    /**
     * Given a groups stored in an Object's properties, sum them up by a property.
     * @param {Object} groups Entities that are grouped by an Object with properties
     * @param {String} group_member_prop Key on an individual entity that will be called for sumation
     */
    sum_categories_by_property(groups,group_member_prop){
        let summed_groups = [];
        Object.keys(groups).forEach(function(group){
            let group_sum=0;
            //For every record in the group, add the key's value to the total sum
            groups[group].forEach(function(group_member){
               group_sum += group_member[group_member_prop];
            });
            summed_groups.push({
                category:group,
                sum:group_sum.toFixed(2),
                isExpense:group_sum < 0});
        });              
        return summed_groups;
    },
    /**
     * Given Monefy records, calculate some financial metrics and predictions
     * @param {*} input_records Monefy records (can be filtered)
     */
    generate_metrics_from_records(input_records){

        let metrics = {
            income:0,
            costs:0,
            daily:
                {
                    income:0,
                    costs:0,
                    balance:0
            },
            savings:{
                daily:0,
                monthly:0,
                yearly:0
            }
        };

        input_records.forEach(function(record){
            let amount = parseFloat(record.amount);
            if(amount>=0) metrics.income+= amount;
            else metrics.costs += amount;
        });

        let dayMs = 86400000;
        metrics.days = Math.round((input_records[input_records.length - 1].date - input_records[0].date)/dayMs);
        metrics.balance = metrics.income + metrics.costs;

        metrics.daily.income = metrics.income / metrics.days;
        metrics.daily.costs = metrics.costs / metrics.days;
        metrics.daily.balance = metrics.balance / metrics.days;

        metrics.savings.daily =  metrics.daily.balance;
        metrics.savings.monthly =  metrics.daily.balance * 30;
        metrics.savings.yearly =  metrics.daily.balance * 365;

        return metrics
    },
     /**
     * Given Monefy records, calculate metrics per year on a monthly frequency
     * @param {*} input_records Monefy records (can be filtered)
     */
    get_year_month_total_metrics(input_records){
        //TODO set ranged based on loaded min and maximum year        
        const range = [1990,new Date().getUTCFullYear()+1];
        let metrics = {};
        
        //For each year within the range create an object for the monthly summary of the income, cost and balance
        for(let y = range[0];y < range[1];y++)
        {
            metrics[y]={};
            for(let m=0;m < 12; m++){
                metrics[y][m]={"income":0,"cost":0,"balance":0};
            }
        }

        input_records.forEach(function(record){
            //Add expense/income to the correct year, month and catagory
            let month = record.date.getMonth();
            let year = record.date.getUTCFullYear();
            let amount = parseFloat(record.amount);
            if(amount>=0) metrics[year][month].income+= amount;
            else metrics[year][month].cost += amount;
        });

        //All incomes and expenses are asigned, now calculate the balance for all months
        for(let y = range[0];y < range[1];y++)
        {
            for(let m=0;m < 12; m++){
                metrics[y][m].balance=metrics[y][m].income +  metrics[y][m].cost;
            }
        }
        return metrics
    }
}