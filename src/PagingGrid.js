isc.defineClass("QM_PagingGrid", "ListGrid");

isc.QM_PagingGrid.addProperties({
    width:"100%",
    height:"100%",
    pageSize: 50,
    labelTotal: "Total %r record(s), %p page(s).",
    
    initWidget : function () {
    	var curGrid = this;
    	
    	//call parent construct
    	this.Super("initWidget", arguments);
    	
    	this.curPage = 1;
    	this.maxPage = 1;
    	
    	this.pageNumForm = isc.DynamicForm.create({
        	width: 42,
        	fields:[{
        		name:"PageNum", type:"integer", 
        		showTitle: false, length:8, 
        		width: 40, textAlign: "center", 
        		mask:"###", maskPromptChar:"",
        		keyPress: function(item, form, keyName, characterValue){ 
        			if(keyName=="Enter") curGrid.onChangePage(curGrid, item.getValue()); 
        			},
        	}]
        });
    	
    	this.footLabel = isc.Label.create({
            padding:5,
            width: 500,
            contents: ""
        });
    	
    	this.gridFooterBar = isc.ToolStrip.create({
    	    //ID: "gridEditControls",
    	    width: "100%", height:24, 
    	    members: [
    	        this.footLabel,
    	        isc.LayoutSpacer.create({ width:"*" }),
    	        isc.ToolStripButton.create({
    	            icon: "[SKIN]/actions/first.png",
    	            prompt: "First page",
    	            click: function() {curGrid.onFirstPage(curGrid);}
    	        }),
    	        isc.ToolStripButton.create({
    	            icon: "[SKIN]/actions/prev.png", 
    	            prompt: "Previous page",
    	            click: function() {curGrid.onPrevPage(curGrid);}
    	        }),
    	        this.pageNumForm ,
    	        isc.ToolStripButton.create({
    	            icon: "[SKIN]/actions/next.png", 
    	            prompt: "Next page",
    	            click: function() {curGrid.onNextPage(curGrid);}
    	        }),
    	        isc.ToolStripButton.create({
    	            icon: "[SKIN]/actions/last.png", 
    	            prompt: "Last page",
    	            click: function(){curGrid.onLastPage(curGrid);}
    	        })
    	    ]
    	});
    	
    	this.gridComponents = ["header", "body", this.gridFooterBar];
    	curGrid.pageNumForm.getField("PageNum").setValue(curGrid.curPage);
    },
    
    
    loadData : function(pageNum, pageSize, item) {
    	
    },
    
    onFirstPage : function(curGrid) {
    	curGrid.loadData(1, curGrid.pageSize, curGrid, curGrid);
    	curGrid.pageNumForm.getField("PageNum").setValue(curGrid.curPage);
    },
    
    onPrevPage : function(curGrid) {
    	if(curGrid.curPage>1) curGrid.curPage--;
    	curGrid.loadData(curGrid.curPage, curGrid.pageSize, curGrid);
    	curGrid.pageNumForm.getField("PageNum").setValue(curGrid.curPage);
    },
    
    onNextPage : function(curGrid) {
    	if(curGrid.curPage<curGrid.maxPage) curGrid.curPage++;
    	curGrid.loadData(curGrid.curPage, curGrid.pageSize, curGrid);
    	curGrid.pageNumForm.getField("PageNum").setValue(curGrid.curPage);
    },
    
    onLastPage : function(curGrid) {
    	curGrid.loadData(curGrid.maxPage, curGrid.pageSize, curGrid);
    	curGrid.pageNumForm.getField("PageNum").setValue(curGrid.curPage);
    },
    
    onChangePage : function(curGrid, pageNum) {
    	if(pageNum.length==0 || pageNum<=0 || pageNum > curGrid.maxPage){
    		curGrid.pageNumForm.getField("PageNum").setValue(curGrid.curPage);
    		return;
    	}
    	curGrid.curPage = pageNum;
    	curGrid.loadData(curGrid.curPage, curGrid.pageSize, curGrid);
    },

    setTotal : function(n) {
    	this.maxPage = Math.ceil(n / this.pageSize);
    	this.pageNumForm.getField("PageNum").setValue(this.curPage);
    	
    	var str = this.labelTotal;
    	str = str.replace("%r", n);
    	str = str.replace("%p", this.maxPage);
    	this.footLabel.setContents(str);
    }

});
