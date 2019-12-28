import { Component, OnInit, QueryList, ElementRef, ViewChildren } from '@angular/core';
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
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
  @ViewChildren("checkboxes") checkboxes2: any;
  constructor(
    private ProductTypeService: ProductTypeService,
    private formBuilder: FormBuilder,
    private titleSerive: Title,
    private toasterService: ToastrService,
    private attributeService: AttributesService
  ) {
    this.titleSerive.setTitle('ProductType Management');
    // this.initDatatable();
    this.getAllProductTypes();
  }

  ngOnInit() {
    this.getAllAttributes();
    this.initProductTypeForm();
    this.initCheckboxForm();
  }

  // *************** INTIALIZE FUNCTIONS *****************//
  initDatatable() {
    $('#typeTable').DataTable().clear().destroy();
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
      is_active: ['', Validators.required],
      attributes: this.formBuilder.array([])
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
        } else {
          this.toasterService.warning('No Attributes No Found', 'Retry Again');
        }
      }
    });
  }

  getAllProductTypes() {
    this.allProductTypes.length = 0;
    this.initDatatable();
    this.ProductTypeService.getAllProductType().subscribe((res: ResponseModel) => {
      console.log(res);
      if (res.errors) {
        this.toasterService.error('Retry Again', 'Error While Fetching Data');
      } else {
        if (res.data.length > 0) {
          this.allProductTypes = res.data;
          this.dtTrigger.next();
        }
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
        this.toasterService.success('Product Type Added!', 'Success!');
        this.allProductTypes.push(res.data);
        this.datatableDestroy();
        this.resetForm();
        jQuery('#AddFormModal').modal('hide');
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
        this.toasterService.info('Brand Updated Successfully!', 'Updated!!');
        this.resetForm();
        this.allProductTypes.splice(this.selectedIndex, 1, res.data);
        this.datatableDestroy();
        this.selectedProductType = null;
        this.editing = false;
        jQuery('#modal3').modal('hide');
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
    // this.ProductTypeForm.get('attributes').setValue(this.selectedAttributesArray);
    console.log(this.ProductTypeForm.value);
    if (this.editing) {
      this.ProductTypeForm.value.attributes.length = 0;
      for (var i = 0; i < this.checkboxes2._results.length; i++) {
        if (this.checkboxes2._results[i].nativeElement.checked == true) {
          this.ProductTypeForm.value.attributes.push(this.allAttributes[i]._id)
        }
      }
    } else {
      for (var i = 0; i < this.checkboxes2._results.length; i++) {
        if (this.checkboxes2._results[i].nativeElement.checked == true) {
          this.ProductTypeForm.value.attributes.push(this.allAttributes[i]._id)
        }
      }
    }
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
    console.log(i);
    this.editing = true;
    this.selectedProductType = this.allProductTypes[i];
    this.selectedID = this.allProductTypes[i]._id;
    this.selectedIndex = i;
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
    this.setFormValue();
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
    // this.ProductTypeForm.get('').setValue();
    console.log(this.selectedProductType);
    if (this.selectedProductType.attributes) {
      let attributes: any = this.selectedProductType.attributes;
      for (let i = 0; i < attributes.length; i++) {
        let att = attributes[i]._id
        for (var j = 0; j < this.allAttributes.length; j++) {
          if (att == this.allAttributes[j]._id) {
            this.checkboxes2._results[j].nativeElement.checked = true;
          }
        }
      }
    }
    this.ProductTypeForm.get('name').setValue(this.selectedProductType.name);
    this.ProductTypeForm.get('is_active').setValue(this.selectedProductType.is_active);
  }
  // *************** RESET FUNCTIONS *****************//
  resetForm() {
    this.ProductTypeForm.reset();
    this.initProductTypeForm();
    this.submitted = false;
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
  }

  datatableDestroy() {
    jQuery('#typeTable').DataTable().destroy();
    this.dtTrigger.next();
  }

}
