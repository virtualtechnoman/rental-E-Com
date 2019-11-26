import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { ResponseModel } from '../../../shared/shared.model';
import { ProductTypeService } from './shared/product.types.service';
import { ProductTypeModel } from './shared/product.types.model';
import { AttrubuteModel } from '../attributes/shared/attributes.model';
import { AttributesService } from '../attributes/shared/attributes.service';

@Component({
  selector: 'app-types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.scss']
})
export class TypesComponent implements OnInit {

  allAttributes: AttrubuteModel[] = [];
  allProductTypes: ProductTypeModel[] = [];
  checkboxesForm: FormGroup;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  editing: Boolean = false;
  ProductTypeForm: FormGroup;
  selectedAttributesArray: AttrubuteModel[] = [];
  selectedAttributesArray2: AttrubuteModel[] = [];
  selectedID: String;
  selectedIndex: number;
  selectedProductType: ProductTypeModel;
  submitted: Boolean = false;

  constructor(
    private ProductTypeService: ProductTypeService,
    private formBuilder: FormBuilder,
    private titleSerive: Title,
    private toasterService: ToastrService,
    private attributeService: AttributesService
  ) {
    this.titleSerive.setTitle('ProductType Management');
    this.initDatatable();
    this.getAllProductTypes();
  }

  ngOnInit() {
    this.getAllAttributes();
    this.initProductTypeForm();
    this.initCheckboxForm();
  }

  // *************** INTIALIZE FUNCTIONS *****************//
  initDatatable() {
    // $('#').DataTable().clear().destroy();
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [
        [10, 15, 25, -1],
        [10, 15, 25, 'All']
      ],
      destroy: true,
      retrive: true,
      // dom: "<'html5buttons'B>lTfgitp",
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
      }, initComplete: function (settings, json) {
        $('.button').removeClass('dt-button');
      },
      dom: 'l  f r t i p',
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
  }

  initCheckboxForm() {
    this.checkboxesForm = this.formBuilder.group({
      _id: this.formBuilder.array([])
    });
  }

  initProductTypeForm() {
    this.ProductTypeForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(40)]],
      attributes: []
    });
  }

  // *************** GET FUNCTIONS *****************//
  get getProductTypeForm() {
    return this.ProductTypeForm.controls;
  }
  get getFormArray() {
    return this.ProductTypeForm.get('options') as FormArray;
  }

  getAllAttributes() {
    this.attributeService.getAllAttributes().subscribe((res: ResponseModel) => {
      if (res.errors) {
        this.toasterService.error('Retry Again', 'Error While Fetching Data');
      } else {
        if (res.data.length > 0) {
          this.allAttributes = res.data;
          console.log(this.allAttributes);
        } else {
          this.toasterService.warning('No Attributes No Found', 'Retry Again');
        }
      }
    });
  }
  getAllProductTypes() {
    this.ProductTypeService.getAllProductType().subscribe((res: ResponseModel) => {
      if (res.errors) {
        this.toasterService.error('Retry Again', 'Error While Fetching Data');
      } else {
        this.allProductTypes = res.data;
        console.log(this.allProductTypes);
      }
    });
  }

  // *************** ADD FUNCTIONS *****************//
  addOptionInForm(): void {
    this.getFormArray.push(this.formBuilder.group({ value: '' }));
  }

  addProductType() {
    this.ProductTypeService.addProductType(this.ProductTypeForm.value).subscribe((res: ResponseModel) => {
      if (res.errors) {
        this.toasterService.error('Error While Adding', 'Refresh And Retry Again');
      } else {
        console.log(res.data);
        jQuery('#modal3').modal('hide');
        this.toasterService.success('Brand Added!', 'Success!');
        this.allProductTypes.push(res.data);
        this.resetForm();
      }
    });
  }
  // *************** UPDATE FUNCTIONS *****************//
  updateProductType(ProductTypes) {
    const id = this.allProductTypes[this.selectedIndex]._id;
    this.ProductTypeService.updateProductType(id, ProductTypes).subscribe((res: ResponseModel) => {
      if (res.errors) {
        this.toasterService.error('Error While Updating ProductType!', 'Refresh and Retry Again');
      } else {
        jQuery('#modal3').modal('hide');
        this.toasterService.info('Brand Updated Successfully!', 'Updated!!');
        this.resetForm();
        this.allProductTypes.splice(this.selectedIndex, 1, res.data);
        this.selectedProductType = null;
        this.editing = false;
      }
    });
  }
  // *************** DELETE FUNCTIONS *****************//
  deleteProductType(i) {
    if (confirm('You Sure you want to delete this Brand')) {
      this.ProductTypeService.deleteProductType(this.allProductTypes[i]._id).toPromise().then(() => {
        this.toasterService.warning('Brand Deleted!', 'Deleted!');
        this.allProductTypes.splice(i, 1);
      }).catch((err) => console.log(err));
    }
  }
  // *************** SUBMIT FUNCTIONS *****************//
  onSubmit() {
    this.submitted = true;
    this.ProductTypeForm.get('attributes').setValue(this.selectedAttributesArray);
    console.log(this.ProductTypeForm.value);
    if (this.ProductTypeForm.invalid) {
      return;
    }
    if (this.editing) {
      this.updateProductType(this.ProductTypeForm.value);
    } else {
      this.addProductType();
    }
  }
  // *************** CALCULATE FUNCTIONS *****************//
  viewProductType(i) {
    this.selectedProductType = this.allProductTypes[i];
    this.selectedID = this.allProductTypes[i]._id;
    this.selectedIndex = i;
  }

  editProductType(i) {
    this.editing = true;
    this.selectedProductType = this.allProductTypes[i];
    this.selectedID = this.allProductTypes[i]._id;
    this.selectedIndex = i;
    // this.setFormValue();
  }

  checkboxChange(_id: string, isChecked: boolean) {
    const checkBoxArray = <FormArray>this.checkboxesForm.controls._id;
    if (isChecked) {
      checkBoxArray.push(new FormControl(_id));
    } else {
      const index = checkBoxArray.controls.findIndex(x => x.value === _id);
      checkBoxArray.removeAt(index);
    }
    this.selectedAttributesArray = checkBoxArray.value;
    console.log(this.selectedAttributesArray);
  }
  // *************** SET FUNCTIONS *****************//
  setFormValue() {

  }
  // *************** RESET FUNCTIONS *****************//
  resetForm() {
    this.ProductTypeForm.reset();
    this.initProductTypeForm();
    this.submitted = false;
  }


}
