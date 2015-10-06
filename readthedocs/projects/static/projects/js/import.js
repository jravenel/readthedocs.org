require=function e(r,t,n){function o(a,i){if(!t[a]){if(!r[a]){var u="function"==typeof require&&require;if(!i&&u)return u(a,!0);if(s)return s(a,!0);var c=new Error("Cannot find module '"+a+"'");throw c.code="MODULE_NOT_FOUND",c}var l=t[a]={exports:{}};r[a][0].call(l.exports,function(e){var t=r[a][1][e];return o(t?t:e)},l,l.exports,e,r,t,n)}return t[a].exports}for(var s="function"==typeof require&&require,a=0;a<n.length;a++)o(n[a]);return o}({1:[function(e,r,t){function n(e){return/^(GET|HEAD|OPTIONS|TRACE)$/.test(e)}function o(e){var r=null;if(document.cookie&&""!=document.cookie)for(var t=document.cookie.split(";"),n=0;n<t.length;n++){var o=jQuery.trim(t[n]);if(o.substring(0,e.length+1)==e+"="){r=decodeURIComponent(o.substring(e.length+1));break}}return r}$.ajaxSetup({beforeSend:function(e,r){if(!n(r.type)&&!this.crossDomain){var t=o("csrftoken");e.setRequestHeader("X-CSRFToken",t)}}}),r.exports={get_cookie:o}},{}],2:[function(e,r,t){function n(e){function r(){s.getJSON(e.url).success(function(e){e.finished?e.success?t.resolve():t.reject({message:e.error}):setTimeout(r,2e3)}).error(function(e){if(console.error("Error polling task:",e),n-=1,n>0)setTimeout(r,2e3);else{var o=e.responseJSON.detail||e.statusText;t.reject({message:o})}})}var t=s.Deferred(),n=5;return setTimeout(r,2e3),t}function o(e){var r=s.Deferred();return $.ajax({method:"POST",url:e,success:function(e){n(e).then(function(){r.resolve()}).fail(function(e){r.reject(e)})},error:function(e){var t=e.responseJSON.detail||e.statusText;r.reject({message:t})}}),r}var s=e("jquery");r.exports={poll_task:n,trigger_task:o}},{jquery:"jquery"}],"projects/import":[function(e,r,t){function o(e,r){var t=this;t.id=u.observable(e.id),t.name=u.observable(e.name),t.slug=u.observable(e.slug),t.active=u.observable(e.active),t.avatar_url=u.observable(i(e.avatar_url,{size:32})),t.display_name=u.computed(function(){return t.name()||t.slug()}),t.filtered=u.computed(function(){var e=r.filter_org();return e&&e!=t.id()})}function s(e,r){var t=this;t.id=u.observable(e.id),t.name=u.observable(e.name),t.full_name=u.observable(e.full_name),t.description=u.observable(e.description),t.vcs=u.observable(e.vcs),t.organization=u.observable(),t.html_url=u.observable(e.html_url),t.clone_url=u.observable(e.clone_url),t.ssh_url=u.observable(e.ssh_url),t.matches=u.observable(e.matches),t.match=u.computed(function(){var e=t.matches();return e&&e.length>0?e[0]:void 0}),t["private"]=u.observable(e["private"]),t.active=u.observable(e.active),t.admin=u.observable(e.admin),t.is_locked=u.computed(function(){return t["private"]()&&!t.admin()}),t.avatar_url=u.observable(i(e.avatar_url,{size:32})),t.import_repo=function(){var e={name:t.name(),repo:t.clone_url(),repo_type:t.vcs(),description:t.description(),project_url:t.html_url()},n=c("<form />");n.attr("action",r.urls.projects_import).attr("method","POST"),Object.keys(e).map(function(r){var t=c("<input>").attr("type","hidden").attr("name",r).attr("value",e[r]);n.append(t)});var o=v.get_cookie("csrftoken"),s=c("<input>");s.attr("type","hidden").attr("name","csrfmiddlewaretoken").attr("value",o),n.append(s),n.submit()}}function a(e,r){var t=this;t.urls=r||{},t.error=u.observable(null),t.is_syncing=u.observable(!1),t.is_ready=u.observable(!1),t.page_count=u.observable(null),t.page_current=u.observable(null),t.page_next=u.observable(null),t.page_previous=u.observable(null),t.filter_org=u.observable(null),t.organizations_raw=u.observableArray(),t.organizations=u.computed(function(){var e=[],r=t.organizations_raw();for(n in r){var s=new o(r[n],t);e.push(s)}return e}),t.projects=u.observableArray(),u.computed(function(){var e=t.filter_org(),r=(t.organizations(),t.page_current()||t.urls["remoterepository-list"]);e&&(r=i(t.urls["remoterepository-list"],{org:e})),t.error(null),c.getJSON(r).success(function(e){var r=[];t.page_next(e.next),t.page_previous(e.previous);for(n in e.results){var o=new s(e.results[n],t);r.push(o)}t.projects(r)}).error(function(e){var r=e.responseJSON.detail||e.statusText;t.error({message:r})}).always(function(){t.is_ready(!0)})}),t.get_organizations=function(){c.getJSON(t.urls["remoteorganization-list"]).success(function(e){t.organizations_raw(e.results)}).error(function(e){var r=e.responseJSON.detail||e.statusText;t.error({message:r})})},t.sync_projects=function(){var e=t.urls.api_sync_remote_repositories;t.error(null),t.is_syncing(!0),l.trigger_task(e).then(function(e){t.get_organizations()}).fail(function(e){t.error(e)}).always(function(){t.is_syncing(!1)})},t.has_projects=u.computed(function(){return t.projects().length>0}),t.next_page=function(){t.page_current(t.page_next())},t.previous_page=function(){t.page_current(t.page_previous())},t.set_filter_org=function(e){var r=t.filter_org();r==e&&(e=null),t.filter_org(e)}}function i(e,r){var t=c("<a>").attr("href",e).get(0);return Object.keys(r).map(function(e){t.search&&(t.search+="&"),t.search+=e+"="+r[e]}),t.href}var u=e("knockout"),c=e("jquery"),l=e("readthedocs/core/static-src/core/js/tasks"),v=e("readthedocs/core/static-src/core/js/django-csrf");c(function(){var e=c("#id_repo"),r=c("#id_repo_type");e.blur(function(){var t,n=e.val();switch(!0){case/^hg/.test(n):t="hg";break;case/^bzr/.test(n):case/launchpad/.test(n):t="bzr";break;case/trunk/.test(n):case/^svn/.test(n):t="svn";break;default:case/github/.test(n):case/(^git|\.git$)/.test(n):t="git"}r.val(t)})}),a.init=function(e,r,t){var n=new a(r,t);return n.get_organizations(),u.applyBindings(n,e),n},r.exports.ProjectImportView=a},{jquery:"jquery",knockout:"knockout","readthedocs/core/static-src/core/js/django-csrf":1,"readthedocs/core/static-src/core/js/tasks":2}]},{},[]);