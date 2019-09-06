import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ProductsService } from '../shared/products.service';
import { ResponseModel } from '../../../shared/shared.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {
  imageUrl="https://binsar.s3.ap-south-1.amazonaws.com/"
  brandForm:FormGroup;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  editing:boolean=false;
  submitted:boolean=false;
  allBrand:any[]=[];
  viewArray:any=[];
  currentBrand:any;
  currentBrandId:any;
  currentIndex:number
  fileSelected: any;
  keyProductImage: any;
  urlProductImage: any;
  showImage:boolean=false;
  image:any;
  editShowImage:boolean=false
  editImage: any;
  mastImage: any;
  constructor(private formBuilder:FormBuilder,private productService:ProductsService, private toastr:ToastrService) {

    this.getAllBrand()

   }

  ngOnInit() {
    this.dtOptions = {
      pagingType: "full_numbers",
      lengthMenu: [
        [10, 15, 25, -1],
        [10, 15, 25, 'All']
      ],
      destroy: true,
      retrive: true,
      dom: '<"html5buttons"B>lTfgitp',
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
      },
      // dom: 'Bfrtip',
      buttons: [
        // 'colvis',
        'copy',
        'print',
        'excel',
      ]
    };
    this.brandForm = this.formBuilder.group({
      name: ['', Validators.required],
      logo: [''],
      contact:['', Validators.required],
      address:['', Validators.required],
    });
  }

  get f() { return this.brandForm.controls; }

  selectFile(event:any){
    this.fileSelected=event.target.files[0];
    console.log(this.fileSelected)
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.brandForm.value);
    if (this.brandForm.invalid) {
      return;
    }

    if(this.fileSelected){
      this.productService.getUrl().subscribe((res:ResponseModel)=>{
        console.log(res.data)
        this.keyProductImage=res.data.key;
        this.urlProductImage=res.data.url;
          
      if(this.urlProductImage){
        this.productService.sendUrl(this.urlProductImage,this.fileSelected).then(resp=>{
          if(resp.status == 200 ){
            this.brandForm.value.logo=this.keyProductImage;
            
           console.log(this.brandForm.value)
           if (this.editing) {
            this.updateBrand(this.brandForm.value);
          } else {
            this.addBrand(this.brandForm.value);
          }
            // this.addVehicle(this.VehicleForm.value);
          }
        })
      }
      })
    }else{
      
      console.log(this.brandForm.value)
      if (this.editing) {
          if(!this.fileSelected){
        this.brandForm.value.logo=this.mastImage
          }
        console.log(this.mastImage)
        this.updateBrand(this.brandForm.value);
          
      } else {
        delete this.brandForm.value.logo;
        this.addBrand(this.brandForm.value);
      }
  }
  }
  addBrand(brand){
    console.log(brand)
    this.productService.addBrand(brand).subscribe((res: ResponseModel) => {
      jQuery('#modal3').modal('hide');
      this.toastr.success('Brand Added!', 'Success!');
      this.allBrand.push(res.data);
      console.log(res.data)
      this.resetForm();
    })
  }

  updateBrand(brand) {
    const id = this.allBrand[this.currentIndex]._id;
    // product._id = id;
    console.log(brand);
    this.productService.updateBrand(brand, id).subscribe((res: ResponseModel) => {
      jQuery('#modal3').modal('hide');
      this.toastr.info('Brand Updated Successfully!', 'Updated!!');
      this.resetForm();
      this.allBrand.splice(this.currentIndex, 1, res.data);
      this.currentBrandId = null;
      this.editing = false;
    });
  }

  getAllBrand(){
    this.allBrand.length = 0;
    this.productService.getAllBrand().subscribe((res: ResponseModel) => {
      console.log(res);
      this.allBrand = res.data;
      console.log(this.allBrand);
      this.dtTrigger.next();
    });
  }

  viewBrand(i) {
    this.viewArray = this.allBrand[i];
    if(this.viewArray.logo){
      this.showImage=true;
    this.image= this.imageUrl + this.viewArray.logo
    console.log(this.image)
    }
    else{
      this.showImage=false
    }
  }

  editBrand(i) {
    this.editing = true;
    this.currentBrand = this.allBrand[i];
    this.currentBrandId = this.allBrand[i]._id;
    this.currentIndex = i;
    this.setFormValue();
  }

  deleteBrand(i) {
    if (confirm('You Sure you want to delete this Brand')) {
      this.productService.deleteBrand(this.allBrand[i]._id).toPromise().then(() => {
        this.toastr.warning('Brand Deleted!', 'Deleted!');
        this.allBrand.splice(i, 1);
      }).catch((err) => console.log(err));
    }
  }

  setFormValue() {
    const brand = this.allBrand[this.currentIndex];
    this.brandForm.controls['name'].setValue(brand.name);
    this.brandForm.controls['address'].setValue(brand.address);
    this.brandForm.controls['contact'].setValue(brand.contact);
    if(brand.logo){
      this.editShowImage=true;
      this.mastImage=brand.logo
      this.editImage= this.imageUrl + brand.logo
      // this.VehicleForm.controls['image'].setValue(image);
    console.log(this.editImage)
    }else{
      this.editShowImage=false
    }
  }

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.editShowImage=false;
    this.brandForm.reset();
  }
}
