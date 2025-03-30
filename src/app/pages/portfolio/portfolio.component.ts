import { Component, OnInit, signal } from '@angular/core';
import { PortfolioService } from '../../shared/services/portfolio.service';
import { Portfolio } from '../../shared/model/portfolio';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { PokeDollarsComponent } from '../../shared/components/poke-dollars/poke-dollars.component';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-portfolio',
  imports: [LoaderComponent, PokeDollarsComponent, DecimalPipe],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
})
export class PortfolioComponent implements OnInit {
  portfolio = signal<Portfolio | null>(null);
  loading = signal(true);
  constructor(private portfolioService: PortfolioService) {}

  ngOnInit() {
    this.portfolioService.getCurrentUserPortfolio().subscribe((portfolio) => {
      this.portfolio.set(portfolio);
      this.loading.set(false);
      console.log(portfolio);
    });
  }
}
