package fi.muikku.servlet;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

// See http://stackoverflow.com/a/4019476
public class RemoveSessionIdFromURLFilter implements Filter {

  @Override
  public void init(FilterConfig filterConfig) throws ServletException {
  }

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException,
      ServletException {
    HttpServletRequest req = (HttpServletRequest) request;
    HttpServletResponse res = (HttpServletResponse) response;
    HttpSession session = req.getSession();

    if (session.isNew()) {
      res.sendRedirect(res.encodeRedirectURL(req.getRequestURI()));
      return;
    } else if (session.getAttribute("verified") == null) {
      session.setAttribute("verified", true);
      if (req.isRequestedSessionIdFromCookie()) {
        // Get rid of ;jsessionid=...
        res.sendRedirect(req.getRequestURI().split(";jsessionid=")[0]);
        return;
      }
    }

    chain.doFilter(request, response);
  }

  @Override
  public void destroy() {
  }
}
