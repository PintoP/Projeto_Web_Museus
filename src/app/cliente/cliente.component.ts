import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { addDoc } from 'firebase/firestore';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [FormsModule, CommonModule,FooterComponent],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  showLogin: boolean = true;
  showRegister: boolean = false;
  showUserDetails: boolean = false;
  username: string = '';
  password: string = '';
  email: string = '';
  userData: any = {};

  constructor(private firestore: Firestore, private userService: UserService) {}

  ngOnInit() {
    // Verifica se o email está definido no serviço UserService
    const userEmail = this.userService.getEmail();
    if (userEmail) {
      // Se o email estiver definido, tenta fazer login diretamente
      this.loginWithEmail(userEmail);
    }
  }

  toggleForms() {
    this.showLogin = !this.showLogin;
    this.showRegister = !this.showRegister;
  }

  register() {
    const clienteCollection = collection(this.firestore, 'cliente');
    addDoc(clienteCollection, {
      username: this.username,
      password: this.password,
      email: this.email
    }).then(() => {
      console.log('User registered successfully');
      this.username = '';
      this.password = '';
      this.email = '';
      this.toggleForms();
    }).catch((error) => {
      console.error('Error registering user:', error);
    });
  }

  login() {
    const clienteCollection = collection(this.firestore, 'cliente');
    const q = query(clienteCollection, where('email', '==', this.email), where('password', '==', this.password));
    
    getDocs(q).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        // Usuário encontrado
        const userDoc = querySnapshot.docs[0];
        this.userData = userDoc.data();
  
        // Atribua o email do usuário à propriedade email
        this.userService.setEmail(this.email);
  
        this.showLogin = false;
        this.showUserDetails = true;
      } else {
        console.error('User not found or incorrect credentials');
      }
    }).catch((error) => {
      console.error('Error during login:', error);
    });
  }

  loginWithEmail(email: string) {
    const clienteCollection = collection(this.firestore, 'cliente');
    const q = query(clienteCollection, where('email', '==', email));
    
    getDocs(q).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        // Usuário encontrado
        const userDoc = querySnapshot.docs[0];
        this.userData = userDoc.data();
  
        // Atribua o email do usuário à propriedade email
        this.userService.setEmail(email);
  
        this.showLogin = false;
        this.showUserDetails = true;
      } else {
        console.error('User not found');
      }
    }).catch((error) => {
      console.error('Error during login:', error);
    });
  }
  
  logout() {
    this.showUserDetails = false;
    this.showLogin = true;
    this.username = '';
    this.password = '';
    this.email = '';
    this.userData = {};
  }
}
