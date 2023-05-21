import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Blog } from 'app/models/blog/blog.model';
import { AccountService } from 'app/services/account.service';
import { BlogService } from 'app/services/blog.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userBlogs: Blog[] = [];

  constructor(
    private blogService: BlogService,
    private router: Router,
    private toastr: ToastrService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    let currentApplicationUserId: number = this.accountService.currentUserValue?.applicationUserId ?? 0;
  
    this.blogService.getByApplicationUserId(currentApplicationUserId).subscribe(userBlogs => {
      this.userBlogs = userBlogs;
    });
  }
  

  confirmDelete(blog: Blog) {
    blog.deleteConfirm = true;
  }

  cancelDeleteConfirm(blog: Blog) {
    blog.deleteConfirm = false;
  }

  deleteConfirmed(blog: Blog, blogs: Blog[]) {
    this.blogService.delete(blog.blogId).subscribe(() => {

      let index = blogs.findIndex(b => b.blogId === blog.blogId);

      if (index > -1) {
        blogs.splice(index, 1);
      }

      this.toastr.info("Blog deleted.");
    });
  }

  editBlog(blogId: number) {
    this.router.navigate([`/dashboard/${blogId}`]);
  }

  createBlog() {
    this.router.navigate(['/dashboard/-1']);
  }
}
