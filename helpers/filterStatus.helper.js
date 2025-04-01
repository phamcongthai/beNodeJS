module.exports.filterStatus = (status) => {
    let filterStatus = [
        {
            name : "Tất cả",
            status : "",
            class : "active"
        },
        {
            name : "Hoạt động",
            status : "active",
            class : ""
        },
        {
            name : "Dừng hoạt động",
            status : "inactive",
            class : ""
        }
    ]
    if(status){
        filterStatus =  filterStatus.map((item) => {
            if(item.status === status){
             item.class = "active"
            }else{
             item.class = ""
            }
            return item;
         })
    }
    return filterStatus;
}