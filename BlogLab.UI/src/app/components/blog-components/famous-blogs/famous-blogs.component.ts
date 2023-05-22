import { Component, OnInit } from '@angular/core';
import { Blog } from 'app/models/blog/blog.model';
import { BlogService } from 'app/services/blog.service';

@Component({
  selector: 'app-famous-blogs',
  templateUrl: './famous-blogs.component.html',
  styleUrls: ['./famous-blogs.component.css']
})
export class FamousBlogsComponent implements OnInit {

  famousBlogs: Blog[] = [];

  constructor(
    private blogService: BlogService
  ) { }

  ngOnInit(): void {
    this.blogService.getMostFamous().subscribe(blogs => {
      this.famousBlogs = blogs;
    });
  }

}