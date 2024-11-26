import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { CollectionReference, collection, getDocs } from 'firebase/firestore';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-evento',
  standalone: true,
  imports: [CommonModule,FooterComponent],
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.css']
})
export class EventoComponent implements OnInit {
  fetchedData: any[] = [];

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    this.fetchDataFromFirestore();
  }

  fetchDataFromFirestore(): void {
    const eventoCollection: CollectionReference = collection(this.firestore, 'evento');
    getDocs(eventoCollection).then((querySnapshot) => {
      this.fetchedData = querySnapshot.docs.map(doc => ({
        nome: doc.data()['Nome'],
        data: doc.data()['data'],
        museu: doc.data()['museu']
      }));
      console.log('Fetched data from Firestore:', this.fetchedData);
    }).catch((error) => {
      console.error('Error fetching data from Firestore:', error);
    });
  }
}
