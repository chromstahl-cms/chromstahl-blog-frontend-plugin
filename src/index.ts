import { Registration } from '@kloudsoftware/chromstahl-plugin'
import { Component } from '@kloudsoftware/eisen';
import { BlogViewComponent } from './blogcomponent/BlogViewComponent'
import { ProsemirrorComponent } from './prosemirror/ProsemirrorComponent';

export default class RegisterPlugin implements Registration {
    register(): Map<string, Component> {
        const m = new Map<string, Component>();
        m.set("/", new BlogViewComponent());
        m.set("/{id}", new BlogViewComponent());
        m.set("/admin/blog/new", new ProsemirrorComponent());
        return m;
    }
}
