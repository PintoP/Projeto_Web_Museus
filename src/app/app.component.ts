import { Component, OnInit } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, CollectionReference } from '@angular/fire/firestore';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'museus_pw';
  fetchedData: any[] = [];

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    this.fetchDataFromFirestore();
  }

  fetchDataFromFirestore(): void {
    const testCollection: CollectionReference = collection(this.firestore, 'test');
    getDocs(testCollection).then((querySnapshot) => {
      this.fetchedData = querySnapshot.docs.map(doc => doc.data());
      console.log('Fetched data from Firestore:', this.fetchedData);
    });
  }
}
