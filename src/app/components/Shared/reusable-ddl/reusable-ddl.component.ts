import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IddlOptions } from 'src/app/Models/ddl-options';
import { ItemsService } from 'src/app/services/items.service';

@Component({
  selector: 'app-reusable-ddl',
  templateUrl: './reusable-ddl.component.html',
  styleUrls: ['./reusable-ddl.component.css']
})
export class ReusableDdlComponent implements OnInit {
  @ViewChild('dropDownList') dropDownListRef!: ElementRef<HTMLElement>
  selectedValues: any = [];
  searchQuery = ''
  uniqueKey: any;
  showKey: any;
  hasError: any = false;
  searchCode: any;
  apiEndPoint: any;
  errorMsg: any;
  page: any;
  limit: any;
  private currentPage: any
  private totalPagesNo: any;
  itemTotalNumber: any
  originalOptions: any = [];
  @Input() options: any = [];
  @Input() inputType: string = '';
  @Input() loading: boolean = false
  @Input() ddlconfigOptions: IddlOptions = {
    isMultiValued: false,
    // items: [],
    uniqueKey: 'id',


  };

  @Input() defualtSelectedValues: any = []

  dropdownOpen = false;
  @Output() selectionEvent = new EventEmitter()
  @Output() loadMore = new EventEmitter()


  constructor(private itemService: ItemsService) { }

  ngOnInit(): void {

    this.showKey = this.ddlconfigOptions.showKey || 'title';
    this.uniqueKey = this.ddlconfigOptions.uniqueKey || 'id'
    this.searchCode = this.ddlconfigOptions.searchKey || 'code'
    this.apiEndPoint = this.ddlconfigOptions.baseUrl
    this.page = this.ddlconfigOptions.page
    this.limit = this.ddlconfigOptions.limit;

    if (this.ddlconfigOptions.baseUrl) {
      this.loadItems()
    } else {
      this.originalOptions = this.getUniqueArray(this.options)
    }
    this.getDefualtSelectedVals()


  }

  loadItems() {
    this.itemService.getItems(this.apiEndPoint, this.page, this.limit, this.searchQuery).subscribe({
      next: (response: any) => {
        const items = response.data.items
        this.itemTotalNumber = response.data.totalNumber
        this.currentPage = response.data.page
        this.totalPagesNo = response.data.numberOfPages
        this.options = [...this.options, ...items]
        this.originalOptions = this.getUniqueArray(this.options)

        this.loading = false;
      },
      error: error => {
        console.error(error, "error")
      }
    })
  }

  getSelectedValues() { return this.selectedValues }

  setSelectItems(items: any) {
    this.selectedValues = items
  }
  onScroll(event: any) {
    if (this.ddlconfigOptions.baseUrl) {
      const element = event.target;
      if (element.scrollHeight - element.scrollTop === element.clientHeight) {
        if (!this.loading && this.options.length < this.itemTotalNumber && this.currentPage < this.totalPagesNo) {
          this.loadMoreItems();
        }
      }
    }

  }

  loadMoreItems() {
    this.page++;
    this.loading = true;
    this.loadItems()
  }



  toggleDropdown(event: MouseEvent) {
    event.stopPropagation()

    this.dropdownOpen = !this.dropdownOpen



  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (this.dropdownOpen && !this.dropDownListRef.nativeElement.contains(target)) {

      this.dropdownOpen = false;
      this.errorMsg = this.ddlconfigOptions.validators.function(this.selectedValues);
      this.hasError = true;


    }
  }

  validate() {
    console.log(this.selectedValues, "check")
    if (this.selectedValues.length == 0) {
      console.log(this.ddlconfigOptions.validators.function(this.selectedValues),"error")
      this.errorMsg = this.ddlconfigOptions.validators.function(this.selectedValues);
      this.hasError = true;
    } else {
      this.hasError = false
    }
  }

  isSelected(option: any): any {
    const value = typeof option === 'object' ? option[this.uniqueKey] : option;
    const index = this.selectedValues.findIndex((selectedOption: any) => {
      const selectedValue = typeof selectedOption === 'object' ? selectedOption[this.uniqueKey] : selectedOption;
      return selectedValue === value;
    });
    return index !== -1
  }

  selectValues(option: any) {
    const value = typeof option === 'object' ? option[this.uniqueKey] : option;
    const optionIndex = this.selectedValues.findIndex((selectedOption: any) => {
      const selectedValue = typeof selectedOption === 'object' ? selectedOption[this.uniqueKey] : selectedOption;
      return selectedValue === value;
    })
    if (optionIndex > -1) {
      this.selectedValues.splice(optionIndex, 1);
    } else {
      if (!this.ddlconfigOptions.isMultiValued) {
        this.selectedValues = [option];
      } else {
        this.selectedValues.push(option);

      }
    }
    this.selectedValues = this.getUniqueArray(this.selectedValues);

    this.selectionEvent.emit(this.selectedValues);
  }



  getDefualtSelectedVals() {
    if (this.defualtSelectedValues) {
      const defaultValuesArray = this.getUniqueArray(this.defualtSelectedValues);

      this.originalOptions = this.getUniqueArray([...this.options, ...defaultValuesArray]);
      this.selectedValues = [...defaultValuesArray]

    }

  }





  displaySelectedVals() {
    return this.selectedValues
      .map((value: any) => {
        const val = value[this.showKey] ? value[this.showKey] : value
        return val;
      })
      .join(', ') || this.ddlconfigOptions.defaultValue || '';

  }

  searchValues() {
    if (this.ddlconfigOptions.baseUrl) {
      if (this.searchQuery.trim() === '') {
        this.page = 1;
        this.options = [];
        this.loadItems();
      } else {
        this.page = 1;
        this.options = [];
        this.loadItems();
      }
    } else {
      const query = this.searchQuery.toLowerCase()
      this.originalOptions = this.getUniqueArray(this.options).filter((option: any) => {
        const showKey = option[this.showKey] ? option[this.showKey] : option;
        const value = option[this.searchCode] ? option[this.searchCode] : showKey
        return value.toString().toLowerCase().includes(query)
      })
    }
  }


  selectAll() {
    if (this.ddlconfigOptions.isMultiValued) {
      if (this.defualtSelectedValues.length > 0) {
        const newArray = [...this.options, ...this.defualtSelectedValues]
        this.selectedValues = [...this.getUniqueArray(newArray)]
      } else {
        this.selectedValues = [...this.getUniqueArray(this.originalOptions)]
        this.selectionEvent.emit(this.selectedValues);
      }

    }
  }

  reset() {
    this.selectedValues = []
    this.originalOptions = this.getUniqueArray(this.options)
    this.searchQuery = ''
  }

  private getUniqueArray(array: any): any[] {
    const uniqueSet = new Set();
    const uniqueArray: any[] = [];
    for (const item of array) {
      const value = item[this.uniqueKey] ? item[this.uniqueKey] : item
      if (!uniqueSet.has(value)) {
        uniqueSet.add(value)
        uniqueArray.push(item)
      }
    }
    return uniqueArray;
  }

}
