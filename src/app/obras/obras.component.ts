import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs, CollectionReference } from '@angular/fire/firestore';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-obras',
  standalone: true,
  imports: [FooterComponent,CommonModule,FormsModule],
  templateUrl: './obras.component.html',
  styleUrl: './obras.component.css'
})
export class ObrasComponent implements OnInit {
  fetchedData: any[] = [];
  filteredData: any[] = [];
  museus: string[] = [];
  autores: string[] = [];
  selectedMuseu: string = '';
  selectedAutor: string = '';

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    this.fetchDataFromFirestore();
  }

  fetchDataFromFirestore(): void {
    const obraCollection: CollectionReference = collection(this.firestore, 'obra');
    getDocs(obraCollection).then((querySnapshot) => {
      this.fetchedData = querySnapshot.docs.map(doc => ({
        Nome: doc.data()['Nome'],
        museu: doc.data()['museu'],
        autor: doc.data()['autor']
      }));
      this.populateFilters();
      this.filterData();
      console.log('Fetched data from Firestore:', this.fetchedData);
    }).catch((error) => {
      console.error('Error fetching data from Firestore:', error);
    });
  }

  populateFilters(): void {
    this.museus = [...new Set(this.fetchedData.map(obra => obra.museu))];
    this.autores = [...new Set(this.fetchedData.map(obra => obra.autor))];
  }

  filterData(): void {
    this.filteredData = this.fetchedData.filter(obra => 
      (this.selectedMuseu ? obra.museu === this.selectedMuseu : true) &&
      (this.selectedAutor ? obra.autor === this.selectedAutor : true)
    );
  }
}
