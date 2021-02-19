class ApiFeatures {
    constructor(query, queyStr) {
        this.query = query;
        this.queryStr = queyStr;
    }
    search(){
        const keyword = this.queryStr.keyword ? {
            refUsuario:{
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        }: {}
        //console.log(keyword);
        this.query = this.query.find({...keyword});
        return this;
    }
    filter(){
        const queryCopy = {...this.queryStr};
        //Removiendo Campos del query
        //console.log(queryCopy)
        const removeFields = ['keyword', 'limit', 'page']
        removeFields.forEach(el => delete queryCopy[el]);
        //console.log(queryCopy)
        this.query = this.query.find(queryCopy);
        return this;
    }
    pagination(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1);
        this.query = this.query.limit(resPerPage).skip(skip)
        return this;
    }
}

module.exports = ApiFeatures;