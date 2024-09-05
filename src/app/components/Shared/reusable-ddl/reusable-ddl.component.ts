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
  label: any;
  defaultTitle: any;
  private currentPage: any
  private totalPagesNo: any;
  itemTotalNumber: any
  originalOptions: any = [];
  options: any = [];
  @Input() inputType: string = '';
  @Input() loading: boolean = false
  @Input() ddlconfigOptions: IddlOptions = {
    isMultiValued: false,
    // items: [],
    uniqueKey: 'id',


  };

  @Input() defualtSelectedValues: any = []
  formControl!: FormControl;
  dropdownOpen = false;
  @Output() selectionEvent = new EventEmitter()
  @Output() loadMore = new EventEmitter()
  @Input() formGroup!: FormGroup; // Accept formGroup from the parent component


  constructor(private itemService: ItemsService) { }

  ngOnInit(): void {

    this.showKey = this.ddlconfigOptions.showKey || 'title';
    this.uniqueKey = this.ddlconfigOptions.uniqueKey || 'id'
    this.searchCode = this.ddlconfigOptions.searchKey || 'code'
    this.apiEndPoint = this.ddlconfigOptions.baseUrl
    this.page = this.ddlconfigOptions.page
    this.limit = this.ddlconfigOptions.limit;
    this.options = this.ddlconfigOptions.optionsArr
    this.label = this.ddlconfigOptions.label;
    this.defaultTitle = this.ddlconfigOptions.defaultTitle
    if (this.ddlconfigOptions.baseUrl) {
      this.loadItems()
    } else {
      this.originalOptions = this.getUniqueArray(this.options)
    }
    this.getDefualtSelectedVals()

    if (this.ddlconfigOptions.isMultiValued) {
      this.formControl = new FormControl('', this.ddlconfigOptions.multiSelectValidators.validators);
      this.formGroup.addControl(this.ddlconfigOptions.name || 'ddlControl', this.formControl);
      console.log(this.formGroup, "form group")

    } else {
      this.formControl = new FormControl('', this.ddlconfigOptions.singleSelectValidators.validators);
      this.formGroup.addControl(this.ddlconfigOptions.name || 'ddlControl', this.formControl);
      console.log(this.formGroup, "form group")
    }

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
      console.log(this.formControl)
      this.hasError = this.formControl.invalid;
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
    this.formControl.setValue(this.selectedValues);
    if (this.ddlconfigOptions.isMultiValued) {
      this.formControl.setValidators(this.ddlconfigOptions.multiSelectValidators.validators)
    } else {
      this.formControl.setValidators(this.ddlconfigOptions.singleSelectValidators.validators)
    }
    this.selectionEvent.emit(this.selectedValues);
  }



  getDefualtSelectedVals() {
    const defaultValuesArray = this.getUniqueArray(this.defualtSelectedValues);
    this.originalOptions = [...defaultValuesArray, ...this.options]
    this.selectedValues = [...defaultValuesArray]


  }


  displaySelectedVals() {
    return this.selectedValues
      .map((value: any) => {
        const val = value[this.showKey] ? value[this.showKey] : value
        return val;
      })
      .join(', ') || this.defaultTitle;

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
