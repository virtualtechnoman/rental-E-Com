import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CategoryModel } from '../shared/product.model';
import { Subject } from 'rxjs';
import { ProductsService } from '../shared/products.service';
import { ResponseModel } from '../../../shared/shared.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  imageUrl="https://binsar.s3.ap-south-1.amazonaws.com/"
  categoryForm: FormGroup;
  submitted = false;
  editing: Boolean = false;
  currentcategory: CategoryModel;
  dtOptions: any = {};
  currentcategoryId: String;
  currentIndex: number;
  dtTrigger: Subject<any> = new Subject();
  allCategory: CategoryModel[] = [];
  viewArray: any = [];
  fileSelected: any;
  keyCategoryImage:any;
  urlCategoryImage:any;
  showImage:boolean=false;
  image:any;
  editShowImage:boolean=false
  editImage: any;
  mastImage: any;
  attributeForm: FormGroup;
  allAttributes:any[]=[];
  showAttributeFor:boolean=false;
  categorySelectedId:any;
  specificCategoryAttributes:any[]=[]
  showSpecificCategoryAttributesLength:boolean=false;
  constructor(private formBuilder: FormBuilder, private productService: ProductsService, private toastr: ToastrService) {
    this.initForm();
  }

  ngOnInit() {
    this.getCategory();
    this.dtOptions = {
      pagingType: "full_numbers",
      lengthMenu: [
        [10, 15, 25, -1],
        [10, 15, 25, 'All']
      ],
      destroy: true,
      retrive: true,
      // dom: '<"html5buttons"B>lTfgitp',
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
      }, initComplete: function (settings, json) {
        $('.button').removeClass('dt-button');
      },
      dom: "l f r t i p",
      // dom:"B<'#colvis row'><'row'><'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-4'i>><'row'p>",
      // buttons: [
      //   {
      //     text: 'Excel',
      //     extend: 'excel',
      //     className: 'table-button btn btn-sm button btn-danger '
      //   },
      //   {
      //     extend: 'print',
      //     text: 'Print',
      //     className: 'table-button btn-sm button btn btn-danger '
      //   },
      //   {
      //     extend: 'pdf',
      //     text: 'PDF',
      //     className: 'table-button btn-sm button btn btn-danger '
      //   }
      // ]
    };
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      is_active: ['', Validators.required],
      image:['']
    });
    this.attributeForm=this.formBuilder.group({
      category:[''],
      name:['',Validators.required]
    })
  }

  get f() { return this.categoryForm.controls; }
  get f2() { return this.attributeForm.controls; }

  selectFile(event:any){
    this.fileSelected=event.target.files[0];
    console.log(this.fileSelected)
  }

  submit() {
    this.submitted = true;
    console.log(this.categoryForm.value);
    if (this.categoryForm.invalid) {
      return;
    }
    this.currentcategory = this.categoryForm.value;
    
    if(this.fileSelected){
      this.productService.getUrlCategory().subscribe((res:ResponseModel)=>{
        console.log(res.data)
        this.keyCategoryImage=res.data.key;
        this.urlCategoryImage=res.data.url;
          
      if(this.urlCategoryImage){
        this.productService.sendUrlCategory(this.urlCategoryImage,this.fileSelected).then(resp=>{
          if(resp.status == 200 ){
            this.categoryForm.value.image=this.keyCategoryImage;
            
           console.log(this.categoryForm.value)
           if (this.editing) {
            this.updateCategory(this.categoryForm.value);
          } else {
            this.addCategory(this.categoryForm.value);
          }
            // this.addVehicle(this.VehicleForm.value);
          }
        })
      }
      })
    }else{
      
      console.log(this.categoryForm.value)
      if (this.editing) {
          if(!this.fileSelected){
        this.categoryForm.value.image=this.mastImage
          }
        console.log(this.mastImage)
        this.updateCategory(this.categoryForm.value);
          
      } else {
        delete this.categoryForm.value.image;
        this.addCategory(this.categoryForm.value);
      }
  }
  }

  addCategory(category) {
    console.log(category)
    this.productService.addCategory(category).subscribe((res: ResponseModel) => {
      jQuery('#modal3').modal('hide');
      this.toastr.success('Product Added!', 'Success!');
      this.allCategory.push(res.data);
      this.resetForm();
    })
  }

  viewCategory(i) {
    // this.specificCategoryAttributes.length=0
    this.viewArray = this.allCategory[i];
    this.categorySelectedId=this.allCategory[i]._id
    if(this.allCategory[i]._id)
    this.productService.getAllAttributeSpecificCategory(this.allCategory[i]._id).subscribe((res:ResponseModel)=>{
      console.log(res.data)
      if(res.data)
      this.specificCategoryAttributes=res.data[0]

  })
    if(this.viewArray.image){
      this.showImage=true;
    this.image= this.imageUrl + this.viewArray.image
    console.log(this.image)
    }
    else{
      this.showImage=false
    }
  }

  editCategory(i) {
    this.editing = true;
    this.currentcategory = this.allCategory[i];
    this.currentcategoryId = this.allCategory[i]._id;
    this.currentIndex = i;
    this.setFormValue();
  }

  deleteCategory(i) {
    if (confirm('You Sure you want to delete this Product')) {
      this.productService.deleteCategory(this.allCategory[i]._id).toPromise().then(() => {
        this.toastr.warning('Products Deleted!', 'Deleted!');
        this.allCategory.splice(i, 1);
      }).catch((err) => console.log(err));
    }
  }

  getCategory() {
    this.allCategory.length = 0;
    this.productService.getAllCategory().subscribe((res: ResponseModel) => {
      console.log(res);
      this.allCategory = res.data;
      console.log(this.allCategory);
      this.dtTrigger.next();
    });
  }

  updateCategory(category) {
    const id = this.allCategory[this.currentIndex]._id;
    // product._id = id;
    console.log(category);
    this.productService.updateCategory(category, id).subscribe((res: ResponseModel) => {
      jQuery('#modal3').modal('hide');
      this.toastr.info('Category Updated Successfully!', 'Updated!!');
      this.resetForm();
      this.allCategory.splice(this.currentIndex, 1, res.data);
      this.currentcategoryId = null;
      this.editing = false;
    });
  }

  initForm() {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      is_active: [false]
    });
  }

  setFormValue() {
    const category:any= this.allCategory[this.currentIndex];
    this.categoryForm.controls['name'].setValue(category.name);
    this.categoryForm.controls['is_active'].setValue(category.is_active);
    if(category.image){
      this.editShowImage=true;
      this.mastImage=category.image
      this.editImage= this.imageUrl + category.image
      // this.VehicleForm.controls['image'].setValue(image);
    console.log(this.editImage)
    }else{
      this.editShowImage=false
    }
  }

  get attributesForm() {
    return this.attributeForm.get('name') as FormArray
  }
  
  addAttribute() {
  
    const attibute = this.formBuilder.group({ 
      name: []
    })
  
    this.attributesForm.push(attibute);
  }
  
  deleteAttribute(i) {
    this.attributesForm.removeAt(i)
  }

  submitAttributeForm(){
    
    if (this.attributeForm.invalid) {
      return;
    }
    this.attributeForm.value.category=this.categorySelectedId
    console.log(this.attributeForm.value)
    this.productService.addAttribute(this.attributeForm.value).subscribe((res:ResponseModel)=>{
      this.toastr.success('Attribute added!', 'Success!');
      this.allAttributes.push(res.data)
      console.log(res.data)
      this.attributeForm.reset()
      jQuery('#attributesModal').modal('hide')
    })
  }

  disableViewCategory(){
    jQuery('#exampleModal').modal('hide')
    
  }

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.editShowImage=false
    this.categoryForm.reset();
  }
}
