import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ProductModel } from '../../products/shared/product.model';
import { AuthService } from '../../../auth/auth.service';
import { ProductsService } from '../../products/shared/products.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { OrderService } from '../shared/order.service';
import { OrderModel } from '../shared/order.model';
import { ResponseModel } from '../../../shared/shared.model';
import { UserService } from '../../user/shared/user-service.service';
import { TruckService } from '../../truck/shared/truck.service';
import { VehicleModel, DriverModel } from '../../truck/shared/truck.model';
import { getMatIconFailedToSanitizeLiteralError } from '@angular/material';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  imageUrl="https://binsar.s3.ap-south-1.amazonaws.com/"
  jQuery: any;
  allproducts: ProductModel[] = [];
  allOrders: any[] = [];
  allUsers: any[] = [];
  orderSelected:any;
  currentOrder: any;
  currentOrderProducts:ProductModel;
  currentOrderPlaced_to:any;
  currentOrderId: any;
  currentIndex: number;
  challanForm: FormGroup;
  valueForm: FormGroup;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  editing: Boolean = false;
  orderForm: FormGroup;
  orderStatus: Boolean;
  CSV: File = null;
  fileReader: FileReader = new FileReader();
  parsedCSV;
  showSummary: Boolean = false;
  uploading: Boolean = false;
  updatedOrder;
  submitted: Boolean = false;
  orderPlacedForm: FormGroup; 
  acceptedValueForm:FormGroup;
  currentOrder2:OrderModel;
  orderIndex:any;
  array:any[]=[];
  orderSelectedProducts:any=[];
  orderSelectedNotes:any;
  orderId:String; 
  driverIndex: any;
  vehicleIndex: any;
  allVehicle: VehicleModel[] = [];
  alldriver: DriverModel[] = [];
  challanDriver:any=[];
  challanVehicle:any=[];
  fieldChangedOrder:OrderModel;
  afterStatus:any;
  selectedStatus:any;
  dispatchValueForm:FormGroup;
  recievedValueForm:FormGroup;
  billedValueForm:FormGroup;
  allFarms:any[]=[];
  orderTime:any;
  noteAcceptedField:any;
  imageAcceptedField:any;
  keyAcceptedField:any;
  urlAcceptedField:any;
  noteDispatchedField:any;
  imageDispatchedField:any;
  keyDispatchedField:any;
  urlDispatchedField:any;
  
  noteRecievedField:any;
  imageRecievedField:any;
  keyRecievedField:any;
  urlRecievedField:any;
  
  noteBilledField:any;
  imageBilledField:any;
  keyBilledField:any;
  urlBilledField:any;
  acceptOrderImage: string;
  showAcceptOrderImage:boolean=false;
  recieveOrderImage: string;
  showRecieveOrderImage:boolean=false;
  billOrderImage: string;
  showBillOrderImage:boolean=false
  acceptOrderNotes: any;
  showAcceptOrderNotes:boolean=false
  showRecieveOrderNotes:boolean=false
  showBillOrderNotes:boolean=false
  recieveOrderNotes: any;
  billOrderNotes: any;
  challanImage: any;
  ChallanNotes: any;
  showChallanImage:boolean=false
  showChallanNotes:boolean=false
  requestedOrderNotes: any;
  showRequestedOrderNotes:boolean=false;
  returnOrderPlacedForm:FormGroup;
  allReturnOrders:any[]=[];
  challanFormReturnOrder:FormGroup;
  recievedValueFormReturnOrder:FormGroup;
  billedValueFormReturnOrder:FormGroup
  imageRecievedFieldReturnOrder: any;
  noteRecievedFieldReturnOrder:any
  keyRecievedFieldReturnOrder:any;
  urlRecievedFieldReturnOrder:any;
  noteBilledFieldReturnOrder:any;
  imageBilledFieldReturnOrder:any;
  keyBilledFieldReturnOrder:any;
  urlBilledFieldReturnOrder:any;
  billOrderImageReturnOrder: string;
  billOrderNotesReturnOrder:any;
  showBillOrderImageReturnOrder:boolean=false;
  showBillOrderNotesReturnOrder:boolean=false;
  recieveOrderImageReturnOrder: string;
  recieveOrderNotesReturnOrder:any;
  showRecieveOrderImageReturnOrder:boolean=false;
  showRecieveOrderNotesReturnOrder:boolean=false;
  requestedNotes: any;
  showRequestedNotes:boolean=false;
  constructor(private productService: ProductsService, private fb: FormBuilder, private toastr: ToastrService,
    private authService: AuthService, private orderService: OrderService, private userService: UserService,private vehicleService: TruckService
  ) {
    // this.initForm();
    // this.initChallanForm();
    this.getOrders();
    this.getUsers();
    this.getVehicle();
    this.getDrivers();
    this.getFarms();
    this.getReturnOrders()
  }

  ngOnInit() {
    this.getProducts();
    this.orderPlacedForm = this.fb.group({
      placed_to: ['',Validators.required],
      notes:"",
      products: this.fb.array([])
    })
    this.acceptedValueForm=this.fb.group({
      accepted:this.fb.array([])
    })
    this.dispatchValueForm=this.fb.group({
      dispatched:this.fb.array([])
    })
    this.recievedValueForm=this.fb.group({
      recieved:this.fb.array([])
    })
    this.billedValueForm=this.fb.group({
      billed:this.fb.array([])
    })
    this.returnOrderPlacedForm = this.fb.group({
      placed_to: ['',Validators.required],
      notes:"",
      products: this.fb.array([])
    })
    this.challanForm = this.fb.group({
      dispatch_processing_unit: ['', Validators.required],
      products:this.fb.array([]),
      vehicle: ['', Validators.required],
      driver: ['', Validators.required],  
      departure: ['', Validators.required],
    });
    this.challanFormReturnOrder = this.fb.group({
      dispatch_processing_unit: ['', Validators.required],
      
      vehicle: ['', Validators.required],
      driver: ['', Validators.required],  
      departure: ['', Validators.required],
    });
    this.recievedValueFormReturnOrder=this.fb.group({
      recieved:this.fb.array([])
    })
    this.billedValueFormReturnOrder=this.fb.group({
      billed:this.fb.array([])
    })

    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [
        [10, 15, 25, -1],
        [10, 15, 25, 'All']
      ],
      destroy: true,
      retrive: true,
      dom: '<\'html5buttons\'B>lTfgitp\'',
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
      },
      // dom: 'Bfrtip',
      buttons: [
        // 'colvis',
        'copy',
        'print',
        'excel',
      ]
    };
  }

  get productsFormsReturnOrder() {
    
    return this.returnOrderPlacedForm.get('products') as FormArray;
    
  }

  addProductsReturnOrder() {

    const product = this.fb.group({ 
      product: [],
      requested: []
    })
  
    this.productsFormsReturnOrder.push(product);
  }

  deleteProductsReturnOrder(i) {
    this.productsFormsReturnOrder.removeAt(i)
  }

  closeInvoiceModal(){
    jQuery('#invoiceModal').modal('hide');
  }

  onSubmitReturnOrder(){
    if (this.returnOrderPlacedForm.invalid) {
      return;
    }
    if(this.returnOrderPlacedForm.value.notes==null){
      this.returnOrderPlacedForm.value.notes=""
    }
    this.returnOrderPlacedForm.value.order=this.orderSelected._id
    console.log(this.returnOrderPlacedForm.value)
    this.orderService.addReturnOrder(this.returnOrderPlacedForm.value).subscribe((res: ResponseModel) => {
      console.log(res.data);
      jQuery('#returnOrdermodal').modal('hide');
      this.toastr.success('Return Order Added!', 'Success!');
      this.allReturnOrders.push(res.data);
      console.log(res.data)
      this.allOrders.splice(this.orderIndex,1,res.data)
      this.resetFormReturnOrder()
  });
  }

  generateReturnOrderChallan(){
    jQuery('#invoiceModal').modal('hide');
  }

  challanGenerateReturnOrder2(){
    const date=new Date()
    this.challanFormReturnOrder.controls['vehicle'].setValue(this.challanVehicle._id)
    this.challanFormReturnOrder.controls['driver'].setValue(this.challanDriver._id)
    this.challanFormReturnOrder.controls['departure'].setValue(date)
    this.challanFormReturnOrder.controls['dispatch_processing_unit'].setValue(this.orderSelected.rorder.placed_to._id)
    console.log(this.challanFormReturnOrder.value)

    this.orderService.addReturnOrderChallan(this.challanFormReturnOrder.value,this.orderSelected.rorder._id).subscribe((res: ResponseModel) => {
      this.toastr.success('Challan Generated successfully', 'Accepted');
      console.log(res.data)
      this.allOrders.splice(this.orderIndex,1,res.data.order)
      jQuery('#returnOrderChallanModal').modal('hide');
    });

    
  }

  recievedQuantityEnteredReturnOrder(event:any,i){
    if((event.target.value==Number(event.target.value)) && (event.target.value<=this.orderSelected.rorder.products[i].requested)){
    var arr;
    arr=event.target.value;
    this.recievedValueFormReturnOrder.value.recieved[i]=arr
    this.qwea();
    }else{
      alert("Enter Recieved Quantity Again")
    }
  }

  qwea(){
    for(var i=0;i<this.recievedValueFormReturnOrder.value.recieved.length;i++){
      this.orderSelected.rorder.products[i].recieved=Number(this.recievedValueFormReturnOrder.value.recieved[i])
    }
  
  }
  
  asdefqw(){
    const order=<any> new Object();
    order.products=this.orderSelected.rorder.products
    for(var i=0;i<this.orderSelected.rorder.products.length;i++){
      order.products[i].product=this.orderSelected.rorder.products[i].product._id;
      if(order.products[i].recieved==0){
        order.products[i].recieved=order.products[i].requested
        }
      delete order.products[i].accepted;
      delete order.products[i].dispatched;
      delete order.products[i].requested;
      delete order.products[i]._id;
      delete order.products[i].billed;
      
    }
    
    console.log(order)

    if(this.imageRecievedFieldReturnOrder){
      this.orderService.getUrl().subscribe((res:ResponseModel)=>{
        // console.log(res.data)
        this.keyRecievedFieldReturnOrder=res.data.key;
        this.urlRecievedFieldReturnOrder=res.data.url;
          
      if(this.urlRecievedFieldReturnOrder){
        this.orderService.sendUrl(this.urlRecievedFieldReturnOrder,this.imageRecievedFieldReturnOrder).then(resp=>{
          if(resp.status == 200 ){
            // this.addVehicle(this.VehicleForm.value);
            if(this.noteRecievedFieldReturnOrder){
              order['remarks.recieveROrder']={
                image:this.keyRecievedFieldReturnOrder,
                note:this.noteRecievedFieldReturnOrder
              }
              console.log(order)
              this.orderService.recievedQuantityStatus(this.orderSelected.rorder._id,order).subscribe((res:ResponseModel)=>{
                jQuery('#invoiceModal').modal('hide');
                this.toastr.info('Order Has Been Accepeted Successfully!', 'Accepeted!!');
                // console.log(res.data)
                this.allOrders.splice(this.orderIndex,1,res.data)
              })
            }else{
            order['remarks.recieveROrder']={
              image:this.keyRecievedFieldReturnOrder,
            }
            console.log(order)
            this.orderService.recievedQuantityStatus(this.orderSelected.rorder._id,order).subscribe((res:ResponseModel)=>{
              jQuery('#invoiceModal').modal('hide');
              this.toastr.info('Order Has Been Accepeted Successfully!', 'Accepeted!!');
              // console.log(res.data)
              this.allOrders.splice(this.orderIndex,1,res.data)
            })
          }
          }
        })
      }
      })
    }
    if(!this.imageRecievedFieldReturnOrder){
      if(this.noteRecievedFieldReturnOrder){
        order['remarks.recieveROrder']={
          note:this.noteRecievedFieldReturnOrder
        }
        console.log(order)
        this.orderService.recievedQuantityStatus(this.orderSelected.rorder._id,order).subscribe((res:ResponseModel)=>{
          jQuery('#invoiceModal').modal('hide');
          this.toastr.info('Order Has Been Accepeted Successfully!', 'Accepeted!!');
          console.log(res.data)
          this.allOrders.splice(this.orderIndex,1,res.data)
        })
      }
    }

    // console.log(order)
    if(!this.imageRecievedFieldReturnOrder && !this.noteRecievedFieldReturnOrder){
      console.log(order)
    this.orderService.recievedQuantityStatus(this.orderSelected.rorder._id,order).subscribe((res:ResponseModel)=>{
      jQuery('#invoiceModal').modal('hide');
      this.toastr.info('Order Has Been Accepeted Successfully!', 'Accepeted!!');
      // console.log(res.data)
      this.allOrders.splice(this.orderIndex,1,res.data)
    })
  }

    // this.orderService.recievedQuantityStatus(this.orderSelected.rorder._id,order).subscribe((res:ResponseModel)=>{
    //   console.log(res.data)
    //   jQuery('#invoiceModal').modal('hide');
    //   this.toastr.success('Recieved Order Challan!', 'Success!');
    //   this.allOrders.splice(this.orderIndex,1,res.data)
    // })
  }

  billedQuantityEnteredReturnOrder(event:any,i){
    if((event.target.value==Number(event.target.value)) && (event.target.value<=this.orderSelected.rorder.products[i].requested)){
    var arr;
    arr=event.target.value;
    this.billedValueFormReturnOrder.value.billed[i]=arr
    this.billedArrayReturnOrder();
    }else{
      alert("Enter Billing Quantity Again")
    }
  }

  billedArrayReturnOrder(){
    for(var i=0;i<this.billedValueFormReturnOrder.value.billed.length;i++){
      this.orderSelected.rorder.products[i].billed=Number(this.billedValueFormReturnOrder.value.billed[i])
    }
  }

  billProductQuantityReturnOrder(){
    const order=<any> new Object();
    order.products=this.orderSelected.rorder.products
    for(var i=0;i<this.orderSelected.rorder.products.length;i++){
      order.products[i].product=this.orderSelected.rorder.products[i].product._id
      if(order.products[i].billed==0){
        order.products[i].billed=order.products[i].recieved
        }
      delete order.products[i].accepted;
      delete order.products[i].dispatched;
      delete order.products[i].recieved;
      delete order.products[i]._id;
      delete order.products[i].requested;
      
    }

    
    console.log(order)

    if(this.imageBilledFieldReturnOrder){
      this.orderService.getUrl().subscribe((res:ResponseModel)=>{
        // console.log(res.data)
        this.keyBilledFieldReturnOrder=res.data.key;
        this.urlBilledFieldReturnOrder=res.data.url;
          
      if(this.urlBilledFieldReturnOrder){
        this.orderService.sendUrl(this.urlBilledFieldReturnOrder,this.imageBilledFieldReturnOrder).then(resp=>{
          if(resp.status == 200 ){
            // this.addVehicle(this.VehicleForm.value);
            if(this.noteBilledFieldReturnOrder){
              order['remarks.billROrder']={
                image:this.keyBilledFieldReturnOrder,
                note:this.noteBilledFieldReturnOrder
              }
              console.log(order)
              this.orderService.recievedBillStatus(this.orderSelected.rorder._id,order).subscribe((res:ResponseModel)=>{
                jQuery('#invoiceModal').modal('hide');
                console.log(res.data)
                this.allOrders.splice(this.orderIndex,1,res.data)
                this.toastr.success('Billed Challan!', 'Success!');
              })
              // this.orderService.recievedBillStatus(this.orderSelected.rorder._id,order).subscribe((res:ResponseModel)=>{
              //   jQuery('#invoiceModal').modal('hide');
              //   console.log(res.data)
              //   this.allOrders.splice(this.orderIndex,1,res.data)
              //   this.toastr.success('Billed Challan!', 'Success!');
              // })
            }else{
            order['remarks.billROrder']={
              image:this.keyBilledFieldReturnOrder
            }
            console.log(order)
            this.orderService.recievedBillStatus(this.orderSelected.rorder._id,order).subscribe((res:ResponseModel)=>{
              jQuery('#invoiceModal').modal('hide');
              console.log(res.data)
              this.allOrders.splice(this.orderIndex,1,res.data)
              this.toastr.success('Billed Challan!', 'Success!');
            })
          }
          }
        })
      }
      })
    }
    if(!this.imageBilledFieldReturnOrder){
      if(this.noteBilledFieldReturnOrder){
        order['remarks.billROrder']={
          note:this.noteBilledFieldReturnOrder
        }
        console.log(order)
        this.orderService.recievedBillStatus(this.orderSelected.rorder._id,order).subscribe((res:ResponseModel)=>{
          jQuery('#invoiceModal').modal('hide');
          console.log(res.data)
          this.allOrders.splice(this.orderIndex,1,res.data)
          this.toastr.success('Billed Challan!', 'Success!');
        })
      }
    }

    // console.log(order)
    if(!this.imageBilledFieldReturnOrder && !this.noteBilledFieldReturnOrder){
      console.log(order)
      this.orderService.recievedBillStatus(this.orderSelected.rorder._id,order).subscribe((res:ResponseModel)=>{
        jQuery('#invoiceModal').modal('hide');
        console.log(res.data)
        this.allOrders.splice(this.orderIndex,1,res.data)
        this.toastr.success('Billed Challan!', 'Success!');
      })
  }

  }

  getReturnOrders() {
    this.orderService.getAllReturnOrders().subscribe((res: ResponseModel) => {
        this.allReturnOrders = res.data;
        console.log(res.data);
    });
  }

  getFarms(){
    this.orderService.getAllFarms().subscribe((res:ResponseModel)=>{
      this.allFarms=res.data;
      // console.log(res.data)
    })
  }
  asd(event:any,i){
    if( (event.target.value==Number(event.target.value)) && (event.target.value<=this.orderSelected.products[i].requested) ){
    var arr=[];
    arr=event.target.value;
    this.acceptedValueForm.value.accepted[i]=arr
    this.array.push
    this.acceptedForms;
    this.qw()
    }
    else{
      alert("Enter Accepted Quantity Again ")
    }
  }

  notesAccepted(event){
    if(event.target.value){
      this.noteAcceptedField=event.target.value
    }
    // console.log(this.noteAcceptedField)
  }

  imageAccepted(event){
    this.imageAcceptedField=event.target.files[0]
    // console.log(this.imageAcceptedField)
  }

  notesDispatched(event){
    if(event.target.value){
      this.noteDispatchedField=event.target.value
    }
    // console.log(this.noteDispatchedField)
  }

  imageDispatched(event){
    this.imageDispatchedField=event.target.files[0]
    // console.log(this.imageDispatchedField)
  }

  notesRecieved(event){
    if(event.target.value){
      this.noteRecievedField=event.target.value
    }
    // console.log(this.noteRecievedField)
  }

  imageRecieved(event){
    this.imageRecievedField=event.target.files[0]
    // console.log(this.imageRecievedField)
  }

  notesBilled(event){
    if(event.target.value){
      this.noteBilledField=event.target.value
    }
    // console.log(this.noteRecievedField)
  }

  imageBilled(event){
    this.imageBilledField=event.target.files[0]
    // console.log(this.imageRecievedField)
  }

  notesRecievedReturnOrder(event){
    if(event.target.value){
      this.noteRecievedFieldReturnOrder=event.target.value
    }
    // console.log(this.noteRecievedField)
  }

  imageRecievedReturnOrder(event){
    this.imageRecievedFieldReturnOrder=event.target.files[0]
    // console.log(this.imageRecievedField)
  }

  notesBilledReturnOrder(event){
    if(event.target.value){
      this.noteBilledFieldReturnOrder=event.target.value
    }
    // console.log(this.noteRecievedField)
  }

  imageBilledReturnOrder(event){
    this.imageBilledFieldReturnOrder=event.target.files[0]
    // console.log(this.imageRecievedField)
  }

  dispatchQuantityEntered(event:any,i){
    
    if((event.target.value==Number(event.target.value)) && (event.target.value<=this.orderSelected.products[i].requested)){
      var arr=event.target.value;
      this.dispatchValueForm.value.dispatched[i]=arr
      this.dispatchArray()
      }
      else{
        alert("Enter Dispatch Quantity Again")
      }
  }

  dispatchArray(){
    for(var i=0;i<this.dispatchValueForm.value.dispatched.length;i++){
      this.orderSelected.products[i].dispatched=Number(this.dispatchValueForm.value.dispatched[i])
    }
  }

  asde(){
    this.orderSelected.status=true;
    const order=<any> new Object;
    order.products=this.orderSelected.products;
    // if(this.noteAcceptedField){
    //   order['remarks.acceptOrder']={
    //     note:this.noteAcceptedField,
    //   }
    // }
    for(var i=0;i<this.orderSelectedProducts.length;i++){
      order.products[i].product=this.orderSelectedProducts[i].product._id
      if(order.products[i].accepted==0){
        order.products[i].accepted=order.products[i].requested
        }
      delete order.products[i]._id;
      delete order.products[i].requested;
      delete order.products[i].recieved;
      delete order.products[i].dispatched;
      delete order.products[i].billed;
    }
    if(this.imageAcceptedField){
      this.orderService.getUrl().subscribe((res:ResponseModel)=>{
        // console.log(res.data)
        this.keyAcceptedField=res.data.key;
        this.urlAcceptedField=res.data.url;
          
      if(this.urlAcceptedField){
        this.orderService.sendUrl(this.urlAcceptedField,this.imageAcceptedField).then(resp=>{
          if(resp.status == 200 ){
            // this.addVehicle(this.VehicleForm.value);
            if(this.noteAcceptedField){
              order['remarks.acceptOrder']={
                image:this.keyAcceptedField,
                note:this.noteAcceptedField
              }
              this.orderService.addAcceptedOrder(this.orderSelected._id,order).subscribe((res:ResponseModel)=>{
                jQuery('#invoiceModal').modal('hide');
                this.toastr.info('Order Has Been Accepeted Successfully!', 'Accepeted!!');
                // console.log(res.data)
                this.allOrders.splice(this.orderIndex,1,res.data)
              })
            }else{
            order['remarks.acceptOrder']={
              image:this.keyAcceptedField,
            }
            this.orderService.addAcceptedOrder(this.orderSelected._id,order).subscribe((res:ResponseModel)=>{
              jQuery('#invoiceModal').modal('hide');
              this.toastr.info('Order Has Been Accepeted Successfully!', 'Accepeted!!');
              // console.log(res.data)
              this.allOrders.splice(this.orderIndex,1,res.data)
            })
          }
          }
        })
      }
      })
    }
    if(!this.imageAcceptedField){
      if(this.noteAcceptedField){
        order['remarks.acceptOrder']={
          note:this.noteAcceptedField
        }
        this.orderService.addAcceptedOrder(this.orderSelected._id,order).subscribe((res:ResponseModel)=>{
          jQuery('#invoiceModal').modal('hide');
          this.toastr.info('Order Has Been Accepeted Successfully!', 'Accepeted!!');
          console.log(res.data)
          this.allOrders.splice(this.orderIndex,1,res.data)
        })
      }
    }

    // console.log(order)
    if(!this.imageAcceptedField && !this.noteAcceptedField){
    this.orderService.addAcceptedOrder(this.orderSelected._id,order).subscribe((res:ResponseModel)=>{
      jQuery('#invoiceModal').modal('hide');
      this.toastr.info('Order Has Been Accepeted Successfully!', 'Accepeted!!');
      // console.log(res.data)
      this.allOrders.splice(this.orderIndex,1,res.data)
    })
  }
  }
  qw(){
    
    for(var i=0;i<this.acceptedValueForm.value.accepted.length;i++){
      this.orderSelected.products[i].accepted=Number(this.acceptedValueForm.value.accepted[i])
    }
  }
  get productsForms() {
    
    return this.orderPlacedForm.get('products') as FormArray;
    
  }

  get acceptedForms() {
    return this.acceptedValueForm.get('accepted') as FormArray;
    
  }
  addProducts() {

    const product = this.fb.group({ 
      product: [],
      requested: []
    })
  
    this.productsForms.push(product);
  }

  addAcceptedQuantity(){
    const accepted=this.fb.group({
      accepted:[]
    })
    this.acceptedForms.push(accepted)
  }
  
  deleteProducts(i) {
    this.productsForms.removeAt(i)
  }
  get f() { return this.orderPlacedForm.controls; }
  get f2() { return this.returnOrderPlacedForm.controls; }

  onSubmit(){
    this.submitted = true;
    if (this.orderPlacedForm.invalid) {
      return;
    }
    this.currentOrder2=this.orderPlacedForm.value;
    // console.log(this.currentOrder2)
    if(this.orderPlacedForm.value.notes==null){
      this.orderPlacedForm.value.notes=""
    }
    // console.log(this.orderPlacedForm.value)
      this.addOrder(this.orderPlacedForm.value);
    
  }
  viewAcceptOrderButton(i){
    this.showAcceptOrderImage=false;
    this.showRecieveOrderImage=false;
    this.showBillOrderImage=false;
    this.orderSelected=this.allOrders[i];
    console.log(this.orderSelected)
    this.orderSelectedProducts=this.allOrders[i].products;
    this.orderSelectedNotes=this.allOrders[i].notes;
    this.orderId=this.allOrders[i]._id
    this.orderIndex=i;
    this.orderTime=this.orderSelected.order_date.substr(11, 8)
    if(this.orderSelected){
      if(this.orderSelected.notes){
        this.requestedOrderNotes=this.orderSelected.notes
        // console.log(this.acceptOrderNotes)
        this.showRequestedOrderNotes=true;
      }else{
        this.showRequestedOrderNotes=false;
      }
    }
    if(this.orderSelected){
    if(this.orderSelected.remarks){
    if(this.orderSelected.remarks.acceptOrder){
    if(this.orderSelected.remarks.acceptOrder.image){
      this.acceptOrderImage=this.imageUrl + this.orderSelected.remarks.acceptOrder.image
      // console.log(this.acceptOrderImage)
      this.showAcceptOrderImage=true;
    }else{
      this.showAcceptOrderImage=false;
    }
    if(this.orderSelected.remarks.acceptOrder.note){
      this.acceptOrderNotes=this.orderSelected.remarks.acceptOrder.note
      // console.log(this.acceptOrderNotes)
      this.showAcceptOrderNotes=true;
    }else{
      this.showAcceptOrderNotes=false;
    }
  }
  }
  }
  if(this.orderSelected){
    if(this.orderSelected.remarks){
    if(this.orderSelected.remarks.recieveOrder){
    if(this.orderSelected.remarks.recieveOrder.image){
      this.recieveOrderImage=this.imageUrl + this.orderSelected.remarks.recieveOrder.image
      // console.log(this.recieveOrderImage)
      this.showRecieveOrderImage=true;
    }else{
      this.showRecieveOrderImage=false;
    }
    if(this.orderSelected.remarks.recieveOrder.note){
      this.recieveOrderNotes=this.orderSelected.remarks.recieveOrder.note
      // console.log(this.recieveOrderNotes)
      this.showRecieveOrderNotes=true;
    }else{
      this.showRecieveOrderNotes=false;
    }
  }
}
  }
  if(this.orderSelected){
    if(this.orderSelected.remarks){
    if(this.orderSelected.remarks.billOrder){
    if(this.orderSelected.remarks.billOrder.image){
      this.billOrderImage=this.imageUrl + this.orderSelected.remarks.billOrder.image
      // console.log(this.billOrderImage)
      this.showBillOrderImage=true;
    }else{
      this.showBillOrderImage=false;
    }
    if(this.orderSelected.remarks.billOrder.note){
      this.billOrderNotes=this.orderSelected.remarks.billOrder.note
      console.log(this.billOrderNotes)
      this.showBillOrderNotes=true;
    }else{
      this.showBillOrderNotes=false;
    }
    }
  }
}
if(this.orderSelected){
  if(this.orderSelected.remarks){
  if(this.orderSelected.remarks.generateChallan){
  if(this.orderSelected.remarks.generateChallan.image){
    this.challanImage=this.imageUrl + this.orderSelected.remarks.generateChallan.image
    // console.log(this.challanImage)
    this.showChallanImage=true;
  }else{
    this.showChallanImage=false;
  }
  if(this.orderSelected.remarks.generateChallan.note){
    this.ChallanNotes=this.orderSelected.remarks.generateChallan.note
    // console.log(this.ChallanNotes)
    this.showChallanNotes=true;
  }else{
    this.showChallanNotes=false;
  }
  }
}
}


if(this.orderSelected){
  if(this.orderSelected.rorder){
  if(this.orderSelected.rorder.remarks){
  if(this.orderSelected.rorder.remarks.billROrder){
  if(this.orderSelected.rorder.remarks.billROrder.image){
    this.billOrderImageReturnOrder=this.imageUrl + this.orderSelected.rorder.remarks.billROrder.image
    console.log(this.billOrderImageReturnOrder)
    this.showBillOrderImageReturnOrder=true;
  }else{
    this.showBillOrderImageReturnOrder=false;
  }
  if(this.orderSelected.rorder.remarks.billROrder.note){
    this.billOrderNotesReturnOrder=this.orderSelected.rorder.remarks.billROrder.note
    console.log(this.billOrderNotesReturnOrder)
    this.showBillOrderNotesReturnOrder=true;
  }else{
    this.showBillOrderNotesReturnOrder=false;
  }
  }
}
}
}

if(this.orderSelected){
  if(this.orderSelected.rorder){
    this.requestedNotes=this.orderSelected.rorder.notes
    this.showRequestedNotes=true;
  }
else{
  this.showRequestedNotes=false
}}

if(this.orderSelected){
  if(this.orderSelected.rorder){
  if(this.orderSelected.rorder.remarks){
  if(this.orderSelected.rorder.remarks.recieveROrder){
  if(this.orderSelected.rorder.remarks.recieveROrder.image){
    this.recieveOrderImageReturnOrder=this.imageUrl + this.orderSelected.rorder.remarks.recieveROrder.image
    console.log(this.recieveOrderImageReturnOrder)
    this.showRecieveOrderImageReturnOrder=true;
  }else{
    this.showRecieveOrderImageReturnOrder=false;
  }
  if(this.orderSelected.rorder.remarks.recieveROrder.note){
    this.recieveOrderNotesReturnOrder=this.orderSelected.rorder.remarks.recieveROrder.note
    console.log(this.recieveOrderNotesReturnOrder)
    this.showRecieveOrderNotesReturnOrder=true;
  }else{
    this.showRecieveOrderNotesReturnOrder=false;
  }
  }
}
}
}


  }


  addOrder(order) {
    this.orderService.addOrder(order).subscribe((res: ResponseModel) => {
      if (res.error) {
        this.toastr.warning('Error', res.error);
      } else {
        jQuery('#modal3').modal('hide');
        this.toastr.success('Order Added!', 'Success!');
        this.allOrders.push(res.data);
        this.resetForm();
      }
    });
  }

  // editOrder(i) {
  //   this.editing = true;
  //   this.currentOrder = this.allOrders[i];
  //   this.currentOrderProducts=this.allOrders[i].products
  //   this.currentOrderPlaced_to=this.allOrders[i].placed_to;
  //   this.currentOrderId = this.allOrders[i]._id;
  //   this.currentIndex = i;
  //   this.setFormValue();
  // }

  // viewSummary(i) {
  //   while (this.valueArr.length !== 0) { this.valueArr.removeAt(0); }
  //   this.showSummary = true;
  //   this.currentOrder = this.allOrders[i];
  //   for (let index = 0; index < this.currentOrder.products.length; index++) {
  //     this.valueArr.push(this.initValueRows());
  //   }
  //   for (let index = 0; index < this.valueArr.length; index++) {
  //     this.valueArr.controls[index].get('accepted').setValue(this.currentOrder.products[index].accepted);
  //   }
  // }

  deleteOrder(i) {
    if (confirm('You Sure you want to delete this Order')) {
      this.orderService.deleteOrder(this.allOrders[i]._id).toPromise().then(() => {
        this.toastr.warning('Products Deleted!', 'Deleted!');
        this.allOrders.splice(i, 1);
      }).catch((err) => console.log(err));
    }
  }

  getProducts() {
    this.allproducts.length = 0;
    this.productService.getAllProduct().subscribe((res:ResponseModel) => {
      this.allproducts = res.data;
      this.dtTrigger.next();
    });
  }

  getUsers() {
    this.allUsers.length = 0;
    this.userService.getAllUsers().subscribe((res: ResponseModel) => {
      if (res.error) {
        this.toastr.warning('Error', res.error);
      } else {
        this.allUsers = res.data;
      }
    });
  }

  getOrders() {
    this.allOrders.length = 0;
    this.orderService.getAllOrders().subscribe((res: ResponseModel) => {
      if (res.error) {
        this.toastr.warning('Error', res.error);
      } else {
        this.allOrders = res.data;
        // console.log(res.data)
        this.dtTrigger.next();
      }
    });
  }

  getVehicle() {
    this.vehicleService.getAllVehicles().subscribe((res: ResponseModel) => {
      this.allVehicle = res.data;
    });
  }

  getDrivers() {
    this.vehicleService.alldrivers().subscribe((res: ResponseModel) => {
      this.alldriver = res.data;
      // console.log(res.data)
    });
  }

  // updateOrder(order) {
  //   this.orderService.updateOrder(order, this.orderId).subscribe((res: ResponseModel) => {
  //     jQuery('#invoiceModal').modal('hide');
  //     this.toastr.info('Order Has Been Accepeted Successfully!', 'Accepeted!!');
  //     this.resetForm();
  //     this.allOrders.splice(this.orderIndex, 1, res.data);
  //     this.orderId = null;
  //     this.editing = false;
  //   });
  // }

  // initForm() {
  //   this.orderForm = this.formBuilder.group({
  //     status: ['', Validators.required],
  //     placed_to: ['', Validators.required],
  //     notes: [''],
  //     products: this.formBuilder.array([this.initItemRows()])
  //   });
  //   this.valueForm = this.formBuilder.group({
  //     productsArray: this.formBuilder.array([])
  //   });
  // }

  // setFormValue() {
  //   const order:any = this.allOrders[this.currentIndex];
  //   this.orderPlacedForm.controls['placed_to'].setValue(order.placed_to._id);
  //   for(var i=0;i<order.products.length;i++){
  //     this.orderPlacedForm.controls['products'].value[i]=order.products[i];
  //   }
  //   this.orderPlacedForm.controls['notes'].setValue(order.notes);
  //   this.orderPlacedForm.controls['status'].setValue(order.status);
  // }

  get formArr() {
    return this.orderForm.get('products') as FormArray;
  }

  // get valueArr() {
  //   return this.valueForm.get('productsArray') as FormArray;
  // }

  // initItemRows() {
  //   return this.formBuilder.group({
  //     accepted: ['', Validators.required],
  //     product: ['', Validators.required],
  //     quantity: ['', Validators.required],
  //     // value: ['']
  //   });
  // }

  // initValueRows(): FormGroup {
  //   return this.formBuilder.group({
  //     accepted: [''],
  //     // value: ['']
  //   });
  // }


  // addPeriod() {
  //   this.formArr.push(this.initItemRows());
  // }

  // removePeriod(i) {
  //   this.formArr.removeAt(i);
  // }

  public uploadCSV(files: FileList) {
    if (files && files.length > 0) {
      const file: File = files.item(0);
      const reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        this.parsedCSV = reader.result;
        // let csv = reader.result;
        // this.extractData(csv)
      };
    }
  }

  public extractData() {
    this.uploading = true;
    const lines = this.parsedCSV.split(/\r\n|\n/);
    const result = [];
    const headers: any[] = lines[0].split(',');
    if (headers[0] === 'brand' && headers[1] === 'is_active' && headers[2] === 'cif_price' && headers[3] === 'business_unit'
      && headers[4] === 'business_unit_id' && headers[5] === 'distirbutor'
      && headers[6] === 'form' && headers[7] === 'notes' && headers[8] === 'pack_size'
      && headers[9] === 'promoted' && headers[10] === 'range' && headers[11] === 'registered'
      && headers[12] === 'strength' && headers[13] === 'therapy_line_id' && headers[14] === 'therapy_line'
      && headers[15] === 'whole_price' && headers[16] === 'sku_id'
    ) {
      for (let i = 1; i < lines.length - 1; i++) {
        const obj = {};
        const currentline = lines[i].split(',');
        for (let j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentline[j];
        }
        result.push(obj);
      }
      this.productService.importCustomer(result).subscribe(res => {
        setTimeout(() => {
          this.uploading = false;
          this.toastr.success('Product added successfully', 'Upload Success');
          jQuery('#modal2').modal('hide');
          // this.allproducts.push(res);
        }, 1000);
      });
      // this.newproduct = result;
    } else {
      this.toastr.error('Try Again', 'Upload Failed');
      // this.reset();
    }
  }

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.orderPlacedForm.reset();
  }

  // generateChallan() {
  //   jQuery('#challanModel').modal('show');
  //   for (let index = 0; index < this.currentOrder.products.length; index++) {
  //     this.productsArray.push(this.initItemRows());
  //   }
  // }

  saveAndAcceptOrder() {
    const updatedOrder = this.currentOrder;
    updatedOrder.status = false;
  }
  get productsArray() {
    return this.challanForm.get('products') as FormArray;
  }

  // initChallanForm() {
  //   this.challanForm = this.formBuilder.group({
  //     dispatch_processing_unit: ['', Validators.required],
  //     // products: this.formBuilder.array([this.initItemRows()]),
  //     products: [''],
  //     vehicle_no: ['', Validators.required],
  //     vehicle_type: ['', Validators.required],
  //     driver_name: ['', Validators.required],
  //     driver_mobile: ['', Validators.required],
  //     dl_no: ['', Validators.required],
  //     departure: ['', Validators.required],
  //   });
  // }

  // saveChallan() {
  //   const placed_to:any = this.currentOrder.placed_to._id;
  //   const order2 = <any>new Object();
  //   order2.placed_to = placed_to;
  //   delete order2._id; delete order2.placed_by; delete order2.order_date;
  //   order2.products = this.currentOrder.products;
  //   for (let index = 0; index < this.currentOrder.products.length; index++) {
  //     order2.products[index].product = order2.products[index].product._id;
  //     delete order2.products[index]._id;
  //     order2.products[index].accepted = this.currentOrder.products[index].accepted;
  //     order2.products[index].requested = this.currentOrder.products[index].quantity;
  //     delete order2.products[index].quantity;
  //   }
  //   order2.vehicle_no = this.challanForm.get('vehicle_no').value;
  //   order2.vehicle_type = this.challanForm.get('vehicle_type').value;
  //   order2.driver_name = this.challanForm.get('driver_name').value;
  //   order2.driver_mobile = this.challanForm.get('driver_mobile').value;
  //   order2.dl_no = this.challanForm.get('dl_no').value;
  //   order2.departure = this.challanForm.get('departure').value;
  //   order2.status = true;
  //   this.challanForm.get('dispatch_processing_unit').setValue(this.currentOrder.placed_to._id);
  //   this.challanForm.get('products').setValue(this.currentOrder.products);
  //   this.orderForm.get('status').setValue(true);
  //   this.orderService.addNewChallan(this.challanForm.value).subscribe((res: ResponseModel) => {
  //     this.toastr.success('Challan Accepted successfully', 'Accepted');
  //     jQuery('#challanModel').modal('hide');
  //   });
  // }

  getDriver(event: any) {
    this.driverIndex = event.target.selectedIndex - 1;
    this.challanDriver=this.alldriver[this.driverIndex]
    // console.log(this.challanDriver)
  }
  getVehicle2(event: any) {

    this.vehicleIndex = event.target.selectedIndex - 1;
    this.challanVehicle=this.allVehicle[this.vehicleIndex]
  }

  challanGenerate(){
    const date=new Date()
    const productsArray=<any> new Object();
    productsArray.products=this.orderSelected.products;

    for(var i=0;i<this.orderSelected.products.length;i++){
      productsArray.products[i].product=this.orderSelected.products[i].product._id;
      if(productsArray.products[i].dispatched==0){
        productsArray.products[i].dispatched=productsArray.products[i].accepted
        }
      delete productsArray.products[i].accepted;
      delete productsArray.products[i].recieved;
      delete productsArray.products[i].requested;
      delete productsArray.products[i].billed;
      delete productsArray.products[i]._id;
    }
    this.challanForm.controls['vehicle'].setValue(this.challanVehicle._id);
    productsArray.vehicle=this.challanVehicle._id
    this.challanForm.controls['driver'].setValue(this.challanDriver._id)
    productsArray.driver=this.challanDriver._id
    this.challanForm.controls['departure'].setValue(date)
    productsArray.departure=date;
    this.challanForm.controls['dispatch_processing_unit'].setValue(this.orderSelected.placed_to._id)
    productsArray.dispatch_processing_unit=this.orderSelected.placed_to._id
    for(var i=0;i<productsArray.products.length;i++){
      this.challanForm.value.products[i]=productsArray.products[i]
    }

    if(this.imageDispatchedField){
      this.orderService.getUrl().subscribe((res:ResponseModel)=>{
        // console.log(res.data)
        this.keyDispatchedField=res.data.key;
        this.urlDispatchedField=res.data.url;
          
      if(this.urlDispatchedField){
        this.orderService.sendUrl(this.urlDispatchedField,this.imageDispatchedField).then(resp=>{
          if(resp.status == 200 ){
            // this.addVehicle(this.VehicleForm.value);
            if(this.noteDispatchedField){
              productsArray['remarks.generateChallan']={
                image:this.keyDispatchedField,
                note:this.noteDispatchedField
              }
    //           console.log(productsArray)
    this.orderService.addOrderChallan(productsArray,this.orderSelected._id).subscribe((res: ResponseModel) => {
      this.toastr.success('Challan Generated successfully', 'Accepted');
      this.allOrders.splice(this.orderIndex,1,res.data.order)
      jQuery('#ChallanModal').modal('hide');
    });
            }else{
              productsArray['remarks.generateChallan']={
              image:this.keyDispatchedField,
            }
            // console.log(productsArray)
    this.orderService.addOrderChallan(productsArray,this.orderSelected._id).subscribe((res: ResponseModel) => {
      this.toastr.success('Challan Generated successfully', 'Accepted');
      this.allOrders.splice(this.orderIndex,1,res.data.order)
      jQuery('#ChallanModal').modal('hide');
    });
          }
          }
        })
      }
      })
    }
    if(!this.imageDispatchedField){
      if(this.noteDispatchedField){
        productsArray['remarks.generateChallan']={
          note:this.noteDispatchedField
        }
        // console.log(productsArray)
    this.orderService.addOrderChallan(productsArray,this.orderSelected._id).subscribe((res: ResponseModel) => {
      this.toastr.success('Challan Generated successfully', 'Accepted');
      this.allOrders.splice(this.orderIndex,1,res.data.order)
      jQuery('#ChallanModal').modal('hide');
    });
      }
    }

    if(!this.imageDispatchedField && !this.noteDispatchedField){
      // console.log(productsArray)
      this.orderService.addOrderChallan(this.challanForm.value,this.orderSelected._id).subscribe((res: ResponseModel) => {
        this.toastr.success('Challan Generated successfully', 'Accepted');
        this.allOrders.splice(this.orderIndex,1,res.data.order)
        jQuery('#ChallanModal').modal('hide');
      });
    }
    

    
  }

  recievedQuantityEntered(event:any,i){
    if((event.target.value==Number(event.target.value)) && (event.target.value<=this.orderSelected.products[i].requested)){
    var arr;
    arr=event.target.value;
    this.recievedValueForm.value.recieved[i]=arr
    this.qwe();
    }else{
      alert("Enter Recieved Quantity Again")
    }
  }

  qwe(){
    for(var i=0;i<this.recievedValueForm.value.recieved.length;i++){
      this.orderSelected.products[i].recieved=Number(this.recievedValueForm.value.recieved[i])
    }
  
  }

  asdef(){
    const order=<any> new Object();
    order.products=this.orderSelected.products
    
    for(var i=0;i<this.orderSelected.products.length;i++){
      order.products[i].product=this.orderSelected.products[i].product._id
      delete order.products[i].accepted;
      if(order.products[i].recieved==0){
        order.products[i].recieved=order.products[i].dispatched
        }
      delete order.products[i].dispatched;
      delete order.products[i].requested;
      delete order.products[i]._id;
      delete order.products[i].billed;
      
    }

    if(this.imageRecievedField){
      this.orderService.getUrl().subscribe((res:ResponseModel)=>{
        // console.log(res.data)
        this.keyRecievedField=res.data.key;
        this.urlRecievedField=res.data.url;
          
      if(this.urlRecievedField){
        this.orderService.sendUrl(this.urlRecievedField,this.imageRecievedField).then(resp=>{
          if(resp.status == 200 ){
            // this.addVehicle(this.VehicleForm.value);
            if(this.noteRecievedField){
              order['remarks.recieveOrder']={
                image:this.keyRecievedField,
                note:this.noteRecievedField
              }
              this.orderService.recievedChallanStatus(this.orderSelected._id,order).subscribe((res:ResponseModel)=>{
                jQuery('#invoiceModal').modal('hide');
                this.toastr.success('Recieved Order Challan!', 'Success!');
                this.allOrders.splice(this.orderIndex,1,res.data)
              })
            }else{
            order['remarks.recieveOrder']={
              image:this.keyRecievedField,
            }
            this.orderService.recievedChallanStatus(this.orderSelected._id,order).subscribe((res:ResponseModel)=>{
              jQuery('#invoiceModal').modal('hide');
              this.toastr.success('Recieved Order Challan!', 'Success!');
              this.allOrders.splice(this.orderIndex,1,res.data)
            })
          }
          }
        })
      }
      })
    }
    if(!this.imageRecievedField){
      if(this.noteRecievedField){
        order['remarks.recieveOrder']={
          note:this.noteRecievedField
        }
      }
      this.orderService.recievedChallanStatus(this.orderSelected._id,order).subscribe((res:ResponseModel)=>{
        jQuery('#invoiceModal').modal('hide');
        this.toastr.success('Recieved Order Challan!', 'Success!');
        this.allOrders.splice(this.orderIndex,1,res.data)
      })
    }

    if(!this.noteRecievedField && !this.imageRecievedField){
      this.orderService.recievedChallanStatus(this.orderSelected._id,order).subscribe((res:ResponseModel)=>{
        jQuery('#invoiceModal').modal('hide');
        this.toastr.success('Recieved Order Challan!', 'Success!');
        this.allOrders.splice(this.orderIndex,1,res.data)
      })
    }
  }


  billedQuantityEntered(event:any,i){
    if((event.target.value==Number(event.target.value)) && (event.target.value<=this.orderSelected.products[i].requested)){
    var arr;
    arr=event.target.value;
    this.billedValueForm.value.billed[i]=arr
    this.billedArray();
    }else{
      alert("Enter Bill Quantity Again")
    }
  }

  billedArray(){
    for(var i=0;i<this.billedValueForm.value.billed.length;i++){
      this.orderSelected.products[i].billed=Number(this.billedValueForm.value.billed[i])
    }
  }

  billProductQuantity(){
    const order=<any> new Object();
    order.products=this.orderSelected.products

    for(var i=0;i<this.orderSelected.products.length;i++){
      order.products[i].product=this.orderSelected.products[i].product._id;
      if(order.products[i].billed==0){
      order.products[i].billed=order.products[i].recieved
      }
      delete order.products[i].accepted;
      delete order.products[i].dispatched;
      delete order.products[i].recieved;
      delete order.products[i]._id;
      delete order.products[i].requested;
      
    }

    if(this.imageBilledField){
      this.orderService.getUrl().subscribe((res:ResponseModel)=>{
        // console.log(res.data)
        this.keyBilledField=res.data.key;
        this.urlBilledField=res.data.url;
          
      if(this.urlBilledField){
        this.orderService.sendUrl(this.urlBilledField,this.imageBilledField).then(resp=>{
          if(resp.status == 200 ){
            // this.addVehicle(this.VehicleForm.value);
            if(this.noteBilledField){
              order['remarks.billOrder']={
                image:this.keyBilledField,
                note:this.noteBilledField
              }
              this.orderService.recievedBillQuantity(this.orderSelected._id,order).subscribe((res:ResponseModel)=>{
                jQuery('#invoiceModal').modal('hide');
                this.allOrders.splice(this.orderIndex,1,res.data)
                this.toastr.success('Billed Challan!', 'Success!');
              })
            }else{
            order['remarks.billOrder']={
              image:this.keyBilledField,
            }
            this.orderService.recievedBillQuantity(this.orderSelected._id,order).subscribe((res:ResponseModel)=>{
              jQuery('#invoiceModal').modal('hide');
              this.allOrders.splice(this.orderIndex,1,res.data)
              this.toastr.success('Billed Challan!', 'Success!');
            })
          }
          }
        })
      }
      })
    }
    if(!this.imageBilledField){
      if(this.noteBilledField){
        order['remarks.billOrder']={
          note:this.noteBilledField
        }
      }
      this.orderService.recievedBillQuantity(this.orderSelected._id,order).subscribe((res:ResponseModel)=>{
        jQuery('#invoiceModal').modal('hide');
        this.allOrders.splice(this.orderIndex,1,res.data)
        this.toastr.success('Billed Challan!', 'Success!');
      })
    }


    // console.log(order)
    if(!this.imageBilledField && !this.noteBilledField){
    this.orderService.recievedBillQuantity(this.orderSelected._id,order).subscribe((res:ResponseModel)=>{
      jQuery('#invoiceModal').modal('hide');
      this.allOrders.splice(this.orderIndex,1,res.data)
      this.toastr.success('Billed Challan!', 'Success!');
    })
  }
  }
  resetFormReturnOrder(){
    this.submitted = false;
    this.returnOrderPlacedForm.reset();
  }
}
