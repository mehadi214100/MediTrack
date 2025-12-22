$("#saveCategory").click(function(){

    let catid = $("#catid").val()
    let name = $("#categoryName").val()
    let description = $("#categoryDescription").val()
    let csrf = $("input[name=csrfmiddlewaretoken]").val()

    if(!name ){
        alert("Please Enter Category name")
        return
    }

    mydata = {
        "catid":catid,
        "name":name,
        "description":description,
        "csrfmiddlewaretoken":csrf
    }
    output = ""
    $.ajax({
        url:"/add_category/",
        data:mydata,
        method:"POST",
        success:function (data){

            if(data.status=='save'){
                
                categories = data.categories
                for(i=0;i<categories.length;i++){

                    output += `
                    

                    <div class=" category-item flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                            <div class="flex items-center">
                                <div class="bg-blue-100 p-2 rounded-full mr-3">
                                    <i class="fa-regular fa-circle-dot text-blue-600"></i>
                                    
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-900">${categories[i].name}</p>
                                    <p class="text-xs text-gray-500">${categories[i].medicine_count} medicines</p>
                                </div>
                            </div>
                             <div class="flex gap-6">
                                <button data-id=${categories[i].id} class="text-blue-600 hover:text-blue-800 btn-edit">
                                <i class="fas fa-edit"></i>
                                </button>
                                <button data-id=${categories[i].id} class="text-red-500 hover:text-red-600 btn-delete">
                                    <i class="fa-solid fa-trash "></i>
                                </button>
                            </div>
                        </div>

                    `

                }

                $("#categoriesData").html(output);
                closeModal('categoryModal')

            }else{
                alert("Save Faild")
            }

        }
    })


    
})


$("#categoriesData").on("click",'.btn-delete',function (){


    let catid = $(this).attr('data-id')
    let csrf = $("input[name=csrfmiddlewaretoken]").val()
    let mythis = this

     if (!confirm("Are you sure you want to delete this category?")) {
        return;
    }

    $.ajax({
        url:"/delete_category/",
        method:'POST',
        data:{catid:catid,csrfmiddlewaretoken:csrf},
        success: function(data){
            if(data.status==1){
                $(mythis).closest(".category-item").fadeOut(100)
            }else{
                alert("unable to delete")
            }
        }
    })
})


$("#categoriesData").on("click",'.btn-edit',function (){


    let catid = $(this).attr('data-id')
    let csrf = $("input[name=csrfmiddlewaretoken]").val()


    $.ajax({
        url:"/edit_category/",
        method:'POST',
        data:{catid:catid,csrfmiddlewaretoken:csrf},
        success: function(data){
            $("#categoryModalTitle").text("Edit Category");
            $("#catid").val(data.id);
            $("#categoryName").val(data.name);
            $("#categoryDescription").val(data.description);
            openModal('categoryModal');
        }
    })
})