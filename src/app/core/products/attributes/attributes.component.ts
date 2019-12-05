import { Component, OnInit } from '@angular/core';
import { AttrubuteModel } from './shared/attributes.model';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { AttributesService } from './shared/attributes.service';
import { ResponseModel } from '../../../shared/shared.model';
import { ToastrService } from 'ngx-toastr';
import { ProductOptionService } from '../options/shared/product.types.service';

@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.scss']
})
export class AttributesComponent implements OnInit {

  allAttributes: AttrubuteModel[] = [];
  attributeForm: FormGroup;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  editing: Boolean = false;
  optionsForm: FormGroup;
  selectedID: String;
  selectedIndex: number;
  selectedAttribute: AttrubuteModel;
  submitted: Boolean = false;
  newOptionValue: any;

  constructor(
    private attributeService: AttributesService,
    private attributeOptionService: ProductOptionService,
    private formBuilder: FormBuilder,
    private titleSerive: Title,
    private toasterService: ToastrService
  ) {
    this.titleSerive.setTitle('Attribute Management');
    this.initAttributeForm();
  }

  ngOnInit() {
    // this.initDatatable();
    this.getAllAttributes();
    this.initOptionsForm();
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

  initAttributeForm() {
    this.attributeForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(40)]],
      is_active: []
    });
  }

  initOptionsForm() {
    this.optionsForm = this.formBuilder.group({
      parent: [],
      value: ['', [Validators.required, Validators.maxLength(40)]]
    });
  }

  // *************** GET FUNCTIONS *****************//
  get getAttributeForm() {
    return this.attributeForm.controls;
  }

  get getAttributeOptionForm() {
    return this.optionsForm.controls;
  }

  get getFormArray() {
    return this.attributeForm.get('options') as FormArray;
  }

  getAllAttributes() {
    this.initDatatable();
    this.allAttributes.length = 0;
    this.attributeService.getAllAttributes().subscribe((res: ResponseModel) => {
      if (res.errors) {
        this.toasterService.error('Retry Again', 'Error While Fetching Data');
      } else {
        this.allAttributes = res.data;
        console.log(this.allAttributes);
      }
    });
  }
  // *************** ADD FUNCTIONS *****************//
  addOptionInForm(): void {
    this.getFormArray.push(this.formBuilder.group({ value: '' }));
  }

  addAttribute() {
    this.attributeService.addAttributes(this.attributeForm.value).subscribe((res: ResponseModel) => {
      if (res.errors) {
        this.toasterService.error('Error While Adding', 'Refresh And Retry Again');
      } else {
        console.log(res.data);
        jQuery('#AddFormModal').modal('hide');
        this.toasterService.success('Attribute Added!', 'Success!');
        this.allAttributes.push(res.data);
        this.resetForm();
      }
    });
  }

  addAttributeOption() {
    this.attributeOptionService.addProductOptions(this.optionsForm.value).subscribe((res: ResponseModel) => {
      if (res.errors) {
        this.toasterService.error('Error While Adding', 'Refresh And Retry Again');
      } else {
        console.log(res.data);
        // this.getAllAttributes();
        jQuery('#AddOptionFormModal').modal('hide');
        this.selectedAttribute.options.push(res.data);
        this.toasterService.success('Option Added!', 'Success!');
        this.resetOptionsForm();
      }
    });
  }
  // *************** UPDATE FUNCTIONS *****************//
  updateAttribute(attributes) {
    const id = this.allAttributes[this.selectedIndex]._id;
    this.attributeService.updateAttributes(id, attributes).subscribe((res: ResponseModel) => {
      if (res.errors) {
        this.toasterService.error('Error While Updating Attribute!', 'Refresh and Retry Again');
      } else {
        jQuery('#AddFormModal').modal('hide');
        this.toasterService.info('Attribute Updated Successfully!', 'Updated!!');
        this.resetForm();
        this.allAttributes.splice(this.selectedIndex, 1, res.data);
        this.selectedAttribute = null;
        this.editing = false;
      }
    });
  }

  editOption(index) {
    this.selectedAttribute.options[index].editName = !this.selectedAttribute.options[index].editName;
  }
  // *************** DELETE FUNCTIONS *****************//
  deleteAttribute(i) {
    if (confirm('You Sure you want to delete this Brand')) {
      this.attributeService.deleteAttributes(this.allAttributes[i]._id).toPromise().then(() => {
        this.toasterService.warning('Brand Deleted!', 'Deleted!');
        this.allAttributes.splice(i, 1);
      }).catch((err) => console.log(err));
    }
  }
  // *************** SUBMIT FUNCTIONS *****************//
  onSubmit() {
    this.submitted = true;
    console.log(this.attributeForm.value);
    if (this.attributeForm.invalid) {
      return;
    }
    if (this.editing) {
      this.updateAttribute(this.attributeForm.value);
    } else {
      this.addAttribute();
    }
  }
  onOptionFormSubmit() {
    this.submitted = true;
    console.log(this.selectedAttribute);
    this.optionsForm.get('parent').setValue(this.selectedAttribute._id);
    console.log(this.optionsForm.value);
    if (this.optionsForm.invalid) {
      return;
    } else {
      console.log(this.optionsForm.value);
      this.addAttributeOption();
    }
  }
  // *************** CALCULATE FUNCTIONS *****************//
  viewAttribute(i) {
    this.selectedAttribute = this.allAttributes[i];
    this.selectedID = this.allAttributes[i]._id;
    this.selectedIndex = i;
  }
  editAttribute(i) {
    this.editing = true;
    this.selectedAttribute = this.allAttributes[i];
    this.selectedID = this.allAttributes[i]._id;
    this.selectedIndex = i;
    this.setFormValue();
  }
  // *************** SET FUNCTIONS *****************//
  setFormValue() {
    const attribute = this.allAttributes[this.selectedIndex];
    this.attributeForm.controls['name'].setValue(attribute.name);
    this.attributeForm.controls['is_active'].setValue(attribute.is_active);
  }
  // *************** RESET FUNCTIONS *****************//
  resetForm() {
    this.attributeForm.reset();
    this.initAttributeForm();
    this.submitted = false;
  }

  resetOptionsForm() {
    this.optionsForm.reset();
    this.initOptionsForm();
    this.submitted = false;
  }

  optionsValueChanged(event, i) {
    this.newOptionValue = event.target.value;
  }

  editCurrentOptionValue(i) {
    const id = this.selectedAttribute.options[i]._id;
    this.attributeService.updateAttributeOptions(id, { value: this.newOptionValue })
      .subscribe((res: ResponseModel) => {
        if (res.errors) {
          this.toasterService.error('Error While Fetching Data', 'Error');
        } else {
          this.allAttributes.splice(i,1,res.data);
          this.selectedAttribute.options[i].editName = false;
          this.toasterService.success('Value Updated Successfully', 'Success');
        }
      })
  }

  deleteOptionsValue(i) {
    const id = this.selectedAttribute.options[i]._id;
    // if (confirm('You Sure you want to delete this Vehicle')) {
    //   this.vehicleService.deleteVehicle(this.allVehicles[i]._id).toPromise().then(() => {
    //     this.allVehicles.splice(i, 1);
    //     this.toastr.warning('Vehicle Deleted!', 'Deleted!');
    //   }).catch((err) => console.log(err));
    // }
    if (confirm("Are you sure you want to delete this option?")) {
      this.attributeService.deleteSelectedOption(id)
        .subscribe((res: ResponseModel) => {
          if (res.errors) {
            this.toasterService.error('Error While Fetching Data', 'Error');
          } else {
            this.selectedAttribute.options.splice(i,1);
            this.toasterService.success('Value Updated Successfully', 'Success');
          }
        })
    }
  }

}
