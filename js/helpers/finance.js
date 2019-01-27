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
    }
}