// ============================== add category==========================


function CategoryUpdate(categories){

    output = ` <option selected>All Categories</option>`
    for(i=0;i<categories.length;i++){
        output += `
            <option value="${categories[i].id}">${categories[i].name}</option>
        `
    }
    return output;
}

function CategoriesListUpdate(categories){

    output = ""
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
        return output
}


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
                
                output = CategoriesListUpdate(categories)

                $("#categoriesData").html(output);
               
                options = CategoryUpdate(categories)
                $("#searchInventoryCat").html(options);
                $("#medicineCategory").html(options);
                closeModal('categoryModal')

            }else{
                alert("Save Faild")
            }

        }
    })


    
})


// =========================== delete category===============

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
            categories = data.categories
            if(data.status==1){
                $(mythis).closest(".category-item").fadeOut(100)

                options = CategoryUpdate(categories)
                
                $("#searchInventoryCat").html(options);
                $("#medicineCategory").html(options);
            }else{
                alert("unable to delete")
            }
        }
    })
})


// ====================== edit category======================

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


// =======================         Add Supplier       ============

$("#saveSupplier").click(function(){

    let supid = $("#supid").val()
    let name = $("#supplierName").val()
    let email = $("#supplierEmail").val()
    let phone = $("#supplierPhone").val()
    let csrf = $("input[name=csrfmiddlewaretoken]").val()

    if(!name ){
        alert("Please Enter Supplier name")
        return
    }

    if(!phone ){
        alert("Please Enter Supplier Phone Number")
        return
    }

    if(!email ){
        alert("Please Enter Supplier Email")
        return
    }
    
    mydata = {
        "supid":supid,
        "name":name,
        "email":email,
        "phone":phone,
        "csrfmiddlewaretoken":csrf
    }
    
    output = ""
    $.ajax({
        url:"/add_supplier/",
        data:mydata,
        method:"POST",
        success:function (data){

            if(data.status=='save'){
                
                suppliers = data.suppliers
                for(i=0;i<suppliers.length;i++){

                    output += `


                    <div class="supplier-item flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                            <div class="flex items-center">
                                <div class="bg-purple-100 p-2 rounded-full mr-3">
                                    <i class="fas fa-truck text-purple-600"></i>
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-900">${suppliers[i].name}</p>
                                    <p class="text-xs text-gray-500">${suppliers[i].contact_email} | ${suppliers[i].phone}</p>
                                </div>
                            </div>
                            <div class="flex gap-6">
                                <button data-id=${suppliers[i].id} class="text-blue-600 hover:text-blue-800 btn-edit">
                                <i class="fas fa-edit"></i>
                                </button>
                                <button data-id=${suppliers[i].id} class="text-red-500 hover:text-red-600 btn-delete">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>

                        </div>

                    `

                }
                
                $("#suppliersData").html(output);
                closeModal('supplierModal')

            }else{
                alert("Save Faild")
            }

        }
    })


    
})

// =======================         delete Supplier       ============

$("#suppliersData").on("click",'.btn-delete',function (){


    let supid = $(this).attr('data-id')
    let csrf = $("input[name=csrfmiddlewaretoken]").val()
    let mythis = this

     if (!confirm("Are you sure you want to delete this Suppliers?")) {
        return;
    }

    $.ajax({
        url:"/delete_supplier/",
        method:'POST',
        data:{supid:supid,csrfmiddlewaretoken:csrf},
        success: function(data){
            if(data.status==1){
                $(mythis).closest(".supplier-item").fadeOut(100)
            }else{
                alert("unable to delete")
            }
        }
    })
})
// =======================         edit Supplier       ============


$("#suppliersData").on("click",'.btn-edit',function (){


    let supid = $(this).attr('data-id')
    let csrf = $("input[name=csrfmiddlewaretoken]").val()


    $.ajax({
        url:"/edit_supplier/",
        method:'POST',
        data:{supid:supid,csrfmiddlewaretoken:csrf},
        success: function(data){
            $("#supplierModalTitle").text("Edit Supplier");
            $("#supid").val(data.id);
            $("#supplierName").val(data.name);
            $("#supplierEmail").val(data.email);
            $("#supplierPhone").val(data.phone);
            openModal('supplierModal');
        }
    })
})



$("#saveMedicine").click(function (){

    let medicineName = $("#medicineName").val()
    let medicineGeneric = $("#medicineGeneric").val()
    let medicineCategory = $("#medicineCategory").val()
    let medicineReorder = $("#medicineReorder").val()
    let csrf = $("input[name=csrfmiddlewaretoken]").val()

    data = {
        "medicineName":medicineName,
        "medicineGeneric":medicineGeneric,
        "medicineCategory":medicineCategory,
        "medicineReorder":medicineReorder,
        "csrfmiddlewaretoken":csrf
    }
    if(!medicineName || !medicineGeneric || !medicineCategory || ! medicineReorder){
        alert("Please enter all data ")
    }

    $.ajax({
        url:"/add_medichine/",
        data:data,
        method:"POST",

        success:function(data){

            if(data.status == "save"){
                alert("Data Save Successfully")
                
                categories = data.categories
                

                output = CategoriesListUpdate(categories)

                console.log(categories)

                $("#categoriesData").html(output);

                closeModal('medicineModal')
            }else{
                alert("Unable to Save")
            }
        }

    })
})


$(document).ready(function(){
    const $batchInput = $('#batch-number-input');

    $("#medicine-select").change(function(){
        let medid = $(this).val();
        if (!medid) {
                $batchInput.val('Auto Generate it');
                return;
            }
        
        $.ajax({
            url:'/get-batch-number/',
            method:"GET",
            data:{'medicine_id': medid},
            success: function(data){
                    if (data.status === 'success') {
                        $batchInput.val(data.batch_number);
                    } else {
                        $batchInput.val('');
                    }
            }
        })

    })


})

$("#saveBatch").click(function(e){
    e.preventDefault();

    let medicineId = $("#medicine-select").val()
    let batchId = $("#batch-number-input").val()
    let quantity = $("#quantity").val()
    let mfgDate = $("#mfgDate").val()
    let expDate = $("#expDate").val()
    let buyingPrice = $("#buyingPrice").val()
    let supplierId = $("#supplierInfo").val()
    let profitPercentage = $("#profitPercentage").val()
    let additionalNote = $("#additionalNote").val()
    let invoiceNumber = $("#invoiceNumber").val()
    let csrf = $("input[name=csrfmiddlewaretoken]").val()


    data = {
        "medicineId":medicineId,
        "batchId":batchId,
        "quantity":quantity,
        "mfgDate":mfgDate,
        "expDate":expDate,
        "buyingPrice":buyingPrice,
        "supplierId":supplierId,
        "profitPercentage":profitPercentage,
        "additionalNote":additionalNote,
        "csrfmiddlewaretoken":csrf,
        "invoiceNumber":invoiceNumber,
    }
    
    $.ajax({

        url:"/save_batch/",
        data:data,
        method:"POST",
        success:function(data){

            if(data.status=='save'){
                alert("Batch added Successfuly")
                $("form")[0].reset()
                
                let t = data.new_transactions;

                let newData = `

                        <div class="border-l-4 border-green-500 pl-4 py-2 hover:bg-gray-50 transition-colors duration-200">
                                <div class="flex justify-between">
                                    <span class="text-sm font-medium text-gray-900">${t.batch_number}</span>
                                    <span class="text-xs text-gray-500">${t.time} </span>
                                </div>
                                <p class="text-sm text-gray-600">${t.medicine_name} × ${t.quantity}</p>
                            </div>
                `
                $("#recent-transactions-list").prepend(newData);

            }else{
                alert("Save Faild")
            }

        }
    })
})


$(document).ready(function(){
    $("#medicineSelectDispense").change(function (){

        let medid = $(this).val();

        $.ajax({
            url:"/get_medicine_batches/",
            data:{"medid":medid},
            method:"GET",
            success:function(data){
                if(data.status=="success"){

                    medicine_info = data.medicine_info
                    batches_list = data.batches_list
                    output = `
                        <h2 class="text-xl font-semibold text-gray-900">${medicine_info.generic_name}</h2>
                        <p class="text-gray-600">${medicine_info.name}| ${medicine_info.category}</p>
                        <div class="mt-2 flex items-center space-x-4">
                            <span class="text-sm text-gray-500 flex items-center">
                                <i class="fas fa-box mr-1"></i> Total Stock: ${medicine_info.totalstock}
                            </span>
                            <span class="text-sm text-gray-500 flex items-center">
                                <i class="fas fa-calendar-alt mr-1"></i> Batches: ${medicine_info.batch_count}
                            </span>
                        </div>
                    `

                    batches_list_output = ""

                    for(i=0;i<batches_list.length;i++){
                        batch = batches_list[i]


                        let statusClass = "";

                        
                        if (batch.status == "SAFE") {
                            statusClass = "bg-green-100 text-green-800";
                        } else if (batch.status == "WARNING") {
                            statusClass = "bg-yellow-100 text-yellow-800";
                        } else {
                            statusClass = "bg-red-100 text-red-800";
                        }


                        batches_list_output += `

                                <tr class="hover:bg-gray-50">
                                    <td class="px-4 py-4">
                                        <input type="radio" name="batchSelect" class="h-4 w-4 text-blue-600 focus:ring-blue-500">
                                    </td>
                                    <td class="px-4 py-4 text-sm font-medium text-gray-900">${batch.batch_no}</td>
                                    <td class="px-4 py-4 text-sm text-gray-900">${batch.exp_date}</td>
                                    <td class="px-4 py-4">
                                        <span class="px-2 py-1 text-xs rounded-full  ${statusClass} font-bold">${batch.days_left} DAYS</span>
                                    </td>
                                    <td class="px-4 py-4 text-sm text-gray-900">${batch.quantity}</td>
                                    <td class="px-4 py-4">
                                        <span class="px-2 py-1 text-xs rounded-full ${statusClass}">${batch.status}</span>
                                    </td>
                                    <td class="px-4 py-4 text-sm font-semibold text-blue-500">${batch.price} Tk</td>
                                </tr>


                        `
                    }
                    
                    $("#medicineInfo").html(output)
                    $("#batchesLists").html(batches_list_output)
                    

                }else{
                    alert("Server Error")
                }

            }
        })

    })
    
})